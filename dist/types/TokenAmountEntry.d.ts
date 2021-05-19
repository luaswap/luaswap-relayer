import { TokenAmount } from "@luaswap/sdk";
import TokenEntry from "./TokenEntry";
export interface TokenAmountEntry {
    token: TokenEntry;
    amount: string;
    blockNumber: number;
}
export declare const toTokenAmount: (entry: TokenAmountEntry) => TokenAmount;
export declare const fromTokenAmount: (amount: TokenAmount, blockNumber: number) => TokenAmountEntry;
export default TokenAmountEntry;
