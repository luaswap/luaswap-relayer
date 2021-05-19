import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { UniswapV2Pair } from "./UniswapV2Pair";
export declare class UniswapV2PairFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<UniswapV2Pair>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): UniswapV2Pair;
    connect(signer: Signer): UniswapV2PairFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): UniswapV2Pair;
}
