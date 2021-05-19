import { ethers } from "ethers";

import "dotenv/config";

class Ethereum {
    provider: ethers.providers.JsonRpcProvider;
    wallet: ethers.Wallet;

    static Mainnet = new Ethereum(1, process.env.MAINNET_API_KEY, process.env.PRIVATE_KEY);
    static Kovan = new Ethereum(42, process.env.KOVAN_API_KEY, process.env.PRIVATE_KEY);
    static TOMOCHAIN_MAINET_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpc.tomochain.com', 88);
    static TOMOCHAIN_TESTNET_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpc.testnet.tomochain.com', 89);
    static BSC_MAINET_PROVIDER = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io', 56);

    private constructor(chainId: number, apiKey: string, privateKey: string) {
        this.provider = new ethers.providers.JsonRpcProvider('https://rpc.tomochain.com', 88);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    }
}

export default Ethereum;
