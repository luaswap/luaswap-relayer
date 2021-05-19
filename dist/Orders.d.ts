import { ethers } from "ethers";
import Order from "./types/Order";
export declare type OnCreateOrder = (hash: string) => Promise<void> | void;
export declare type OnCancelOrder = (hash: string) => Promise<void> | void;
declare class Orders {
    private static fetchCanceledHashes;
    private static fetchHashes;
    static fetch(provider: ethers.providers.BaseProvider, kovanProvider: ethers.providers.BaseProvider): Promise<Order[]>;
    static fetchOrder(hash: string, kovanProvider: ethers.providers.BaseProvider): Promise<Order>;
    static watch(onCreateOrder: OnCreateOrder, onCancelOrder: OnCancelOrder, provider: ethers.providers.BaseProvider, kovanProvider: ethers.providers.BaseProvider): void;
}
export default Orders;
