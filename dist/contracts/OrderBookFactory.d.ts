import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { OrderBook } from "./OrderBook";
export declare class OrderBookFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<OrderBook>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): OrderBook;
    connect(signer: Signer): OrderBookFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): OrderBook;
}
