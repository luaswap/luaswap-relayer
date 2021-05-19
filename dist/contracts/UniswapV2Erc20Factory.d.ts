import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { UniswapV2Erc20 } from "./UniswapV2Erc20";
export declare class UniswapV2Erc20Factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<UniswapV2Erc20>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): UniswapV2Erc20;
    connect(signer: Signer): UniswapV2Erc20Factory;
    static connect(address: string, signerOrProvider: Signer | Provider): UniswapV2Erc20;
}
