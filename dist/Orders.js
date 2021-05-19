"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrderBook_json_1 = __importDefault(require("./contracts/deployments/kovan/OrderBook.json"));
const Settlement_json_1 = __importDefault(require("./contracts/deployments/mainnet/Settlement.json"));
const ethers_1 = require("ethers");
const contracts_1 = require("./contracts");
const LIMIT = 20;
const BLOCKS_PER_DAY = 400;
class Orders {
    static async fetchCanceledHashes(provider) {
        const fromBlock = (await provider.getBlockNumber()) - BLOCKS_PER_DAY;
        console.log('fromBlock: ', fromBlock);
        const settlement = contracts_1.SettlementFactory.connect(Settlement_json_1.default.address, provider);
        const filter = settlement.filters.OrderCanceled(null);
        return (await settlement.queryFilter(filter, fromBlock)).map(event => event.args[0]);
    }
    static async fetchHashes(kovanProvider) {
        const orderBook = contracts_1.OrderBookFactory.connect(OrderBook_json_1.default.address, kovanProvider);
        const length = (await orderBook.numberOfAllHashes()).toNumber();
        const pages = [];
        for (let i = 0; i * LIMIT < length; i++)
            pages.push(i);
        return (await Promise.all(pages.map(async (page) => await orderBook.allHashes(page, LIMIT))))
            .flat()
            .filter(hash => hash !== ethers_1.ethers.constants.HashZero);
    }
    static async fetch(provider, kovanProvider) {
        const settlement = contracts_1.SettlementFactory.connect(Settlement_json_1.default.address, provider);
        const canceledHashes = await Orders.fetchCanceledHashes(provider);
        const hashes = await Orders.fetchHashes(kovanProvider);
        const now = Math.floor(Date.now() / 1000);
        return (await Promise.all(hashes
            .filter(hash => !canceledHashes.includes(hash))
            .map(async (hash) => {
            const order = await this.fetchOrder(hash, kovanProvider);
            if (order.deadline.toNumber() < now)
                return null;
            const filledAmountIn = await settlement.filledAmountInOfHash(hash);
            if (order.amountIn.eq(filledAmountIn))
                return null;
            return order;
        }))).filter(order => !!order);
    }
    static async fetchOrder(hash, kovanProvider) {
        const orderBook = contracts_1.OrderBookFactory.connect(OrderBook_json_1.default.address, kovanProvider);
        const { maker, fromToken, toToken, amountIn, amountOutMin, recipient, deadline, v, r, s } = await orderBook.orderOfHash(hash);
        return {
            hash,
            maker,
            fromToken,
            toToken,
            amountIn,
            amountOutMin,
            recipient,
            deadline,
            v,
            r,
            s
        };
    }
    static watch(onCreateOrder, onCancelOrder, provider, kovanProvider) {
        const orderBook = contracts_1.OrderBookFactory.connect(OrderBook_json_1.default.address, kovanProvider);
        const settlement = contracts_1.SettlementFactory.connect(Settlement_json_1.default.address, provider);
        orderBook.on("OrderCreated", onCreateOrder);
        settlement.on("OrderCanceled", onCancelOrder);
    }
}
exports.default = Orders;
//# sourceMappingURL=Orders.js.map