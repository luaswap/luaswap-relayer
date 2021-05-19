"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@luaswap/sdk");
const node_fetch_1 = __importDefault(require("node-fetch"));
const TokenEntry_1 = require("./types/TokenEntry");
const contracts_1 = require("./contracts");
const contracts = {};
class Pairs {
    static watch(pair, onSync, provider) {
        const { address } = pair.liquidityToken;
        let contract = contracts[address];
        if (!contract) {
            contract = contracts_1.UniswapV2PairFactory.connect(address, provider);
            contracts[address] = contract;
        }
        contract.removeAllListeners("Sync");
        contract.on("Sync", () => onSync(pair));
    }
    static async fetch(provider) {
        const res = await node_fetch_1.default("https://lite.sushiswap.fi/tokens.json");
        const json = {
            "name": "LuaSwap Default List",
            "timestamp": "2021-04-27T04:25:08.682Z",
            "version": {
                "major": 4,
                "minor": 0,
                "patch": 0
            },
            "tags": {},
            "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB1f66997A5760428D3a87D68b90BfE0aE64121cC/logo.png",
            "keywords": [
                "luaswap",
                "default"
            ],
            "tokens": [
                {
                    "name": "Wrapped Ether",
                    "address": "0x2EAA73Bd0db20c64f53fEbeA7b5F5E5Bccc7fb8b",
                    "symbol": "ETH",
                    "decimals": 18,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                    "blockNumber": null
                },
                {
                    "name": "LuaToken",
                    "address": "0x7262fa193e9590B2E075c3C16170f3f2f32F5C74",
                    "symbol": "LUA",
                    "decimals": 18,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB1f66997A5760428D3a87D68b90BfE0aE64121cC/logo.png",
                    "blockNumber": null
                },
                {
                    "name": "Tomo Finance",
                    "address": "0xB2444519F4653831b097B388D985aB3FdD5D600e",
                    "symbol": "TAI",
                    "decimals": 18,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/tomochain/luaswap-token-list/master/src/tokens/icons/tomochain/0xB2444519F4653831b097B388D985aB3FdD5D600e.png",
                    "blockNumber": null
                },
                {
                    "name": "Wrapped USD Coin",
                    "address": "0xCCA4E6302510d555B654B3EaB9c0fCB223BCFDf0",
                    "symbol": "USDC",
                    "decimals": 6,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
                    "blockNumber": null
                },
                {
                    "name": "Wrapped Tether USD",
                    "address": "0x381B31409e4D220919B2cFF012ED94d70135A59e",
                    "symbol": "USDT",
                    "decimals": 6,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                    "blockNumber": null
                },
                {
                    "name": "Wrapped TOMO",
                    "address": "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC",
                    "symbol": "WTOMO",
                    "decimals": 18,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa/logo.png",
                    "blockNumber": null
                }
            ]
        };
        const { tokens } = json;
        const tokenCombinations = [];
        for (const entryA of tokens) {
            const tokenA = TokenEntry_1.toToken(entryA);
            for (const entryB of tokens) {
                const tokenB = TokenEntry_1.toToken(entryB);
                if (tokenA.address !== tokenB.address && tokenA.sortsBefore(tokenB)) {
                    tokenCombinations.push([tokenA, tokenB]);
                }
            }
        }
        const pairs = await Promise.all(tokenCombinations.map(async (pair) => {
            const [tokenA, tokenB] = pair;
            try {
                return await sdk_1.Fetcher.fetchPairData(tokenA, tokenB, provider);
            }
            catch (e) {
                return null;
            }
        }));
        return { tokens: tokens.map(token => TokenEntry_1.toToken(token)), pairs: pairs.filter(pair => pair != null) };
    }
}
exports.default = Pairs;
//# sourceMappingURL=Pairs.js.map