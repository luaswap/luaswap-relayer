"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromToken = exports.toToken = void 0;
const sdk_1 = require("@luaswap/sdk");
exports.toToken = (entry) => {
    return new sdk_1.Token(entry.chainId, entry.address, entry.decimals, entry.symbol, entry.name);
};
exports.fromToken = (token, blockNumber) => {
    return {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        blockNumber
    };
};
//# sourceMappingURL=TokenEntry.js.map