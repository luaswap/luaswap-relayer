import OrderBook from "./contracts/deployments/kovan/OrderBook.json";
import Settlement from "./contracts/deployments/mainnet/Settlement.json";
import { ethers } from "ethers";
import { OrderBookFactory, SettlementFactory } from "./contracts";
import Order from "./types/Order";

const LIMIT = 20;

export type OnCreateOrder = (hash: string) => Promise<void> | void;
export type OnCancelOrder = (hash: string) => Promise<void> | void;

const BLOCKS_PER_DAY = 21600;

class Orders {
    private static async fetchCanceledHashes(provider: ethers.providers.BaseProvider) {
       // const fromBlock = (await provider.getBlockNumber()) - BLOCKS_PER_DAY;
        //console.log('fromBlock: ',fromBlock)
        const settlement = SettlementFactory.connect(Settlement.address, provider);
        //const filter = settlement.filters.OrderCanceled(null);
        const length = (await settlement.numberOfAllCanceledHashes()).toNumber();
        const pages: number[] = [];
        const allCancelled = await settlement.allCanceledHashes(0, LIMIT)
        for (let i = 0; i * LIMIT < length; i++) pages.push(i);
        return (await Promise.all(pages.map(async page => await settlement.allCanceledHashes(page, LIMIT))))
            .flat()
            .filter(hash => hash !== ethers.constants.HashZero);
    }

    private static async fetchHashes(kovanProvider: ethers.providers.BaseProvider) {
        const orderBook = OrderBookFactory.connect(OrderBook.address, kovanProvider);
        const length = (await orderBook.numberOfAllHashes()).toNumber();
        const pages: number[] = [];
        for (let i = 0; i * LIMIT < length; i++) pages.push(i);
        return (await Promise.all(pages.map(async page => await orderBook.allHashes(page, LIMIT))))
            .flat()
            .filter(hash => hash !== ethers.constants.HashZero);
    }

    static async fetch(provider: ethers.providers.BaseProvider, kovanProvider: ethers.providers.BaseProvider) {
        const settlement = SettlementFactory.connect(Settlement.address, provider);
        const canceledHashes = await Orders.fetchCanceledHashes(provider);
        console.log('canceledHashes: ',canceledHashes)
        const hashes = await Orders.fetchHashes(kovanProvider);
        const now = Math.floor(Date.now() / 1000);
        return (
            await Promise.all(
                hashes
                    .filter(hash => !canceledHashes.includes(hash))
                    .map(async hash => {
                        const order = await this.fetchOrder(hash, kovanProvider);
                        if (order.deadline.toNumber() < now) return null;
                        const filledAmountIn = await settlement.filledAmountInOfHash(hash);
                        if (order.amountIn.eq(filledAmountIn)) return null;
                        return order;
                    })
            )
        ).filter(order => !!order);
    }

    static async fetchOrder(hash: string, kovanProvider: ethers.providers.BaseProvider) {
        const orderBook = OrderBookFactory.connect(OrderBook.address, kovanProvider);
        const {
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
        } = await orderBook.orderOfHash(hash);
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
        } as Order;
    }

    static watch(
        onCreateOrder: OnCreateOrder,
        onCancelOrder: OnCancelOrder,
        provider: ethers.providers.BaseProvider,
        kovanProvider: ethers.providers.BaseProvider
    ) {
        const orderBook = OrderBookFactory.connect(OrderBook.address, kovanProvider);
        const settlement = SettlementFactory.connect(Settlement.address, provider);
        orderBook.on("OrderCreated", onCreateOrder);
        settlement.on("OrderCanceled", onCancelOrder);
    }
}

export default Orders;
