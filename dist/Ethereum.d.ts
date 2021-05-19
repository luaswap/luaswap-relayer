import { ethers } from "ethers";
import "dotenv/config";
declare class Ethereum {
    provider: ethers.providers.JsonRpcProvider;
    wallet: ethers.Wallet;
    static Mainnet: Ethereum;
    static Kovan: Ethereum;
    static TOMOCHAIN_MAINET_PROVIDER: ethers.providers.JsonRpcProvider;
    static TOMOCHAIN_TESTNET_PROVIDER: ethers.providers.JsonRpcProvider;
    static BSC_MAINET_PROVIDER: ethers.providers.JsonRpcProvider;
    private constructor();
}
export default Ethereum;
