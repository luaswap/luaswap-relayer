import { Pair } from "@luaswap/sdk";
import TokenAmountEntry from "./TokenAmountEntry";
import TokenEntry from "./TokenEntry";
export interface PairEntry {
    liquidityToken: TokenEntry;
    tokenAmount0: TokenAmountEntry;
    tokenAmount1: TokenAmountEntry;
    blockNumber: number;
}
export declare const toPair: (entry: PairEntry) => Pair;
export declare const fromPair: (pair: Pair, blockNumber: number) => PairEntry;
export default PairEntry;
