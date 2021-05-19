"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPair = exports.toPair = void 0;
const sdk_1 = require("@luaswap/sdk");
const TokenAmountEntry_1 = require("./TokenAmountEntry");
const TokenEntry_1 = require("./TokenEntry");
exports.toPair = (entry) => {
    return new sdk_1.Pair(TokenAmountEntry_1.toTokenAmount(entry.tokenAmount0), TokenAmountEntry_1.toTokenAmount(entry.tokenAmount1));
};
exports.fromPair = (pair, blockNumber) => {
    return {
        liquidityToken: TokenEntry_1.fromToken(pair.liquidityToken, blockNumber),
        tokenAmount0: TokenAmountEntry_1.fromTokenAmount(pair.reserve0, blockNumber),
        tokenAmount1: TokenAmountEntry_1.fromTokenAmount(pair.reserve1, blockNumber),
        blockNumber
    };
};
//# sourceMappingURL=PairEntry.js.map