import { Fetcher, Pair, Token } from "@luaswap/sdk";
import { ethers } from "ethers";
import fetch from "node-fetch";
import TokenEntry, { toToken } from "./types/TokenEntry";
import { UniswapV2PairFactory } from "./contracts";
import { UniswapV2Pair } from "./contracts/UniswapV2Pair";

export type OnSync = (pair: Pair) => Promise<void> | void;

const contracts: { [address: string]: UniswapV2Pair } = {};

class Pairs {
    static watch(pair: Pair, onSync: OnSync, provider: ethers.providers.BaseProvider) {
        const { address } = pair.liquidityToken;
        let contract = contracts[address];
        if (!contract) {
            contract = UniswapV2PairFactory.connect(address, provider);
            contracts[address] = contract;
        }
        contract.removeAllListeners("Sync");
        contract.on("Sync", () => onSync(pair));
    }

    static async fetch(provider: ethers.providers.BaseProvider) {
        const res = await fetch("https://lite.sushiswap.fi/tokens.json");

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
                    "name": "Wrapped Serum",
                    "address": "0xc01643aC912B6a8ffC50CF8c1390934A6142bc91",
                    "symbol": "SRM",
                    "decimals": 6,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x476c5E26a75bd202a9683ffD34359C0CC15be0fF/logo.png",
                    "blockNumber": null
                },
                {
                    "name": "Wrapped FTX Token",
                    "address": "0x33fa3c0c714638f12339F85dae89c42042a2D9Af",
                    "symbol": "FTT",
                    "decimals": 18,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9/logo.png",
                    "blockNumber": null
                },
                {
                    "name": "Wrapped BTC",
                    "address": "0xA91895630f2DAfdc4FC5c3e32846108068c67004",
                    "symbol": "BTC",
                    "decimals": 8,
                    "chainId": 88,
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
                    "blockNumber": null
                }
        ]
        }

        const { tokens }: { tokens: TokenEntry[] } = json;
        const tokenCombinations: [Token, Token][] = [];
        for (const entryA of tokens) {
            const tokenA = toToken(entryA);
            for (const entryB of tokens) {
                const tokenB = toToken(entryB);
                if (tokenA.address !== tokenB.address && tokenA.sortsBefore(tokenB)) {
                    tokenCombinations.push([tokenA, tokenB]);
                }
            }
        }
        const pairs = await Promise.all(
            tokenCombinations.map(async pair => {
                const [tokenA, tokenB] = pair;
                try {
                    return await Fetcher.fetchPairData(tokenA, tokenB, provider);
                } catch (e) {
                    return null;
                }
            })
        );
        return { tokens: tokens.map(token => toToken(token)), pairs: pairs.filter(pair => pair != null) };
    }
}

export default Pairs;
