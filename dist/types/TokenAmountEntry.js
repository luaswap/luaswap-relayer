"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromTokenAmount = exports.toTokenAmount = void 0;
const sdk_1 = require("@luaswap/sdk");
const TokenEntry_1 = require("./TokenEntry");
exports.toTokenAmount = (entry) => {
    return new sdk_1.TokenAmount(TokenEntry_1.toToken(entry.token), sdk_1.JSBI.BigInt(entry.amount));
};
exports.fromTokenAmount = (amount, blockNumber) => {
    return {
        token: TokenEntry_1.fromToken(amount.token, blockNumber),
        amount: amount.raw.toString(),
        blockNumber
    };
};
//# sourceMappingURL=TokenAmountEntry.js.map