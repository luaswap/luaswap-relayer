"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ethereum_1 = __importDefault(require("./Ethereum"));
const Pairs_1 = __importDefault(require("./Pairs"));
const Log_1 = __importDefault(require("./Log"));
const Orders_1 = __importDefault(require("./Orders"));
const Executor_1 = __importDefault(require("./Executor"));
const sdk_1 = require("@luaswap/sdk");
const mainnet = Ethereum_1.default.Mainnet;
const kovan = Ethereum_1.default.Kovan;
const main = async () => {
    Log_1.default.d("fetching pairs...");
    let { tokens, pairs } = await updateTokensAndPairs(mainnet.provider);
    Log_1.default.d("fetching orders...");
    const orders = await Orders_1.default.fetch(mainnet.provider, kovan.provider);
    Log_1.default.d("found " + orders.length + " orders");
    orders.forEach(order => {
        Log_1.default.d("order.hash  " + order.hash);
    });
    Orders_1.default.watch(async (hash) => {
        Log_1.default.d("order created: " + hash);
        orders.push(await Orders_1.default.fetchOrder(hash, kovan.provider));
    }, hash => {
        Log_1.default.d("order cancelled: " + hash);
        const index = orders.findIndex(order => order.hash === hash);
        if (index >= 0) {
            orders.splice(index, 1);
        }
    }, mainnet.provider, kovan.provider);
    const executor = new Executor_1.default(mainnet.provider);
    Log_1.default.d("listening to new blocks...");
    mainnet.provider.on("block", async (blockNumber) => {
        Log_1.default.d("block: " + blockNumber);
        if (blockNumber % 2880 === 0) {
            const latest = await updateTokensAndPairs(mainnet.provider);
            tokens = latest.tokens;
            pairs = latest.pairs;
        }
        if (blockNumber % 4 === 0) {
            try {
                const matched = await executor.match(tokens, pairs, orders, 10000);
                Log_1.default.d("matched " + matched.length + " orders");
                matched.forEach(order => {
                    var _a;
                    const aux = order.trade
                        ? " at " + ((_a = order.trade) === null || _a === void 0 ? void 0 : _a.executionPrice.toFixed(8)) +
                            " " +
                            order.trade.route.path[order.trade.route.path.length - 1].symbol +
                            "/" +
                            order.trade.route.path[0].symbol
                        : "";
                    Log_1.default.d("  " + order.hash + aux);
                });
                await executor.fillOrders(matched, mainnet.wallet);
            }
            catch (e) {
                Log_1.default.e("error: " + e.reason || e.message || e.toString());
            }
        }
    });
    executor.watch(async (hash) => {
        Log_1.default.d("order filled: " + hash);
        const index = orders.findIndex(o => o.hash === hash);
        if (index >= 0) {
            const order = orders[index];
            const filledAmountIn = await executor.filledAmountIn(order);
            if (filledAmountIn.eq(order.amountIn)) {
                orders.splice(index, 1);
            }
        }
    });
};
const updateTokensAndPairs = async (provider) => {
    const { tokens, pairs } = await Pairs_1.default.fetch(provider);
    Log_1.default.d("found " + tokens.length + " tokens");
    tokens.forEach(token => {
        Log_1.default.d("  " + token.address);
    });
    Log_1.default.d("found " + pairs.length + " pairs");
    pairs.forEach(pair => {
        Log_1.default.d("  " + pair.liquidityToken.address);
        Pairs_1.default.watch(pair, async (syncedPair) => {
            const newPair = await sdk_1.Fetcher.fetchPairData(syncedPair.token0, syncedPair.token1, mainnet.provider);
            const index = pairs.findIndex(p => p.liquidityToken.address === syncedPair.liquidityToken.address);
            if (index >= 0) {
                pairs.splice(index, 1, newPair);
                Log_1.default.d("pair synced: " + syncedPair.liquidityToken.address);
            }
        }, mainnet.provider);
    });
    return { tokens, pairs };
};
main().catch(e => {
    Log_1.default.e(e);
    process.exit(1);
});
//# sourceMappingURL=index.js.map