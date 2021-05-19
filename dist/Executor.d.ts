import { Pair, Token } from "@luaswap/sdk";
import { ethers } from "ethers";
import Order from "./types/Order";
export declare type OnOrderFilled = (hash: string, amountIn: ethers.BigNumber, amountOut: ethers.BigNumber) => Promise<void> | void;
declare class Executor {
    pendingOrders: {
        [orderHash: string]: ethers.ContractTransaction;
    };
    provider: ethers.providers.BaseProvider;
    constructor(provider: ethers.providers.BaseProvider);
    watch(onOrderFilled: OnOrderFilled): void;
    filledAmountIn(order: Order): Promise<ethers.BigNumber>;
    match(tokens: Token[], pairs: Pair[], orders: Order[], timeout: number): Promise<Order[]>;
    fillOrders(orders: Order[], signer: ethers.Signer): Promise<void>;
}
export default Executor;
