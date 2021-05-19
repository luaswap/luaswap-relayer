import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { Settlement } from "./Settlement";
export declare class SettlementFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(orderBookChainId: BigNumberish, orderBookAddress: string, owner: string, _factory: string, _weth: string, _sushi: string, _feeSplitRecipient: string, _feeNumerator: BigNumberish, _feeSplitNumerator: BigNumberish, overrides?: Overrides): Promise<Settlement>;
    getDeployTransaction(orderBookChainId: BigNumberish, orderBookAddress: string, owner: string, _factory: string, _weth: string, _sushi: string, _feeSplitRecipient: string, _feeNumerator: BigNumberish, _feeSplitNumerator: BigNumberish, overrides?: Overrides): TransactionRequest;
    attach(address: string): Settlement;
    connect(signer: Signer): SettlementFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): Settlement;
}
