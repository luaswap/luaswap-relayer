"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
require("dotenv/config");
class Ethereum {
    constructor(chainId, apiKey, privateKey) {
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.tomochain.com', 88);
        this.wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    }
}
Ethereum.Mainnet = new Ethereum(1, process.env.MAINNET_API_KEY, process.env.PRIVATE_KEY);
Ethereum.Kovan = new Ethereum(42, process.env.KOVAN_API_KEY, process.env.PRIVATE_KEY);
Ethereum.TOMOCHAIN_MAINET_PROVIDER = new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.tomochain.com', 88);
Ethereum.TOMOCHAIN_TESTNET_PROVIDER = new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.testnet.tomochain.com', 89);
Ethereum.BSC_MAINET_PROVIDER = new ethers_1.ethers.providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io', 56);
exports.default = Ethereum;
//# sourceMappingURL=Ethereum.js.map