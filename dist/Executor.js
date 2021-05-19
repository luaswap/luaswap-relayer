"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@luaswap/sdk");
const Settlement_json_1 = require("./contracts/deployments/mainnet/Settlement.json");
const Log_1 = __importDefault(require("./Log"));
const contracts_1 = require("./contracts");
const findToken = (tokens, tokenAddress) => {
    return tokens.find(token => token.address === tokenAddress);
};
const deductFee = (amount) => {
    return amount.sub(amount.mul(4).div(1000));
};
const argsForOrder = async (order, signer) => {
    const contract = contracts_1.SettlementFactory.connect(Settlement_json_1.address, signer);
    const arg = {
        order,
        amountToFillIn: order.amountIn,
        path: order.trade.route.path.map(token => token.address)
    };
    delete arg.order.trade;
    try {
        await contract.estimateGas.fillOrder(arg);
        return arg;
    }
    catch (e) {
        Log_1.default.w("  " + JSON.stringify(arg) + " arg");
        Log_1.default.w("  " + order.hash + " will revert");
        return null;
    }
};
class Executor {
    constructor(provider) {
        this.pendingOrders = {};
        this.provider = provider;
    }
    watch(onOrderFilled) {
        const settlement = contracts_1.SettlementFactory.connect(Settlement_json_1.address, this.provider);
        settlement.on("OrderFilled", onOrderFilled);
    }
    async filledAmountIn(order) {
        const settlement = contracts_1.SettlementFactory.connect(Settlement_json_1.address, this.provider);
        return await settlement.filledAmountInOfHash(order.hash);
    }
    async match(tokens, pairs, orders, timeout) {
        const executables = [];
        const now = Date.now();
        for (const order of orders) {
            const fromToken = findToken(tokens, order.fromToken);
            const toToken = findToken(tokens, order.toToken);
            const filledAmountIn = await this.filledAmountIn(order);
            if (fromToken && toToken && order.deadline.toNumber() * 1000 >= now && filledAmountIn.lt(order.amountIn)) {
                const trade = sdk_1.Trade.bestTradeExactIn(pairs, new sdk_1.TokenAmount(fromToken, deductFee(order.amountIn).toString()), toToken, {
                    maxNumResults: 1,
                    maxHops: 3
                })[0];
                if (trade) {
                    const tradeAmountOutMin = trade.minimumAmountOut(new sdk_1.Percent("0"));
                    Log_1.default.w(order.hash + ": " + "tradeAmountOutMin: " + tradeAmountOutMin.raw.toString() + ", order.amountOutMin: " + order.amountOutMin);
                    if (deductFee(order.amountOutMin).lt(tradeAmountOutMin.raw.toString())) {
                        executables.push(Object.assign(Object.assign({}, order), { trade }));
                    }
                }
            }
            if (Date.now() - now > timeout)
                break;
        }
        return executables;
    }
    async fillOrders(orders, signer) {
        const contract = contracts_1.SettlementFactory.connect(Settlement_json_1.address, signer);
        const args = (await Promise.all(orders
            .filter(order => order.trade)
            .filter(order => !this.pendingOrders[order.hash])
            .map(order => argsForOrder(order, signer)))).filter(arg => arg !== null);
        if (args.length > 0) {
            Log_1.default.d("filling orders...");
            args.forEach(arg => {
                Log_1.default.d("  " + arg.order.hash + " (amountIn: " + arg.order.amountIn.toString() + ")");
            });
            const gasLimit = await contract.estimateGas.fillOrders(args);
            const gasPrice = await signer.getGasPrice();
            const tx = await contract.fillOrders(args, {
                gasLimit: gasLimit.mul(120).div(100),
                gasPrice: gasPrice.mul(120).div(100)
            });
            args.forEach(arg => {
                this.pendingOrders[arg.order.hash] = tx;
            });
            tx.wait().then(() => {
                args.forEach(arg => delete this.pendingOrders[arg.order.hash]);
            });
            Log_1.default.d("  tx hash: ", tx.hash);
        }
    }
}
exports.default = Executor;
//# sourceMappingURL=Executor.js.map