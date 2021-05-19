import { Token } from "@luaswap/sdk";
export interface TokenEntry {
    chainId: number;
    address: string;
    decimals: number;
    symbol?: string;
    name?: string;
    blockNumber: number;
}
export declare const toToken: (entry: TokenEntry) => Token;
export declare const fromToken: (token: Token, blockNumber: number) => TokenEntry;
export default TokenEntry;
