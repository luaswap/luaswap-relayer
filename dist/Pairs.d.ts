import { Pair, Token } from "@luaswap/sdk";
import { ethers } from "ethers";
export declare type OnSync = (pair: Pair) => Promise<void> | void;
declare class Pairs {
    static watch(pair: Pair, onSync: OnSync, provider: ethers.providers.BaseProvider): void;
    static fetch(provider: ethers.providers.BaseProvider): Promise<{
        tokens: Token[];
        pairs: Pair[];
    }>;
}
export default Pairs;
