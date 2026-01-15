import { type HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

// --- PENGAMAN ---
// Kode ini mencegah Hardhat Crash (HHE15) kalau PRIVATE_KEY kosong/undefined
const deployerKey = process.env.PRIVATE_KEY;
// Jika key ada isinya, masukkan ke array. Jika tidak, kosongkan.
const accounts = (deployerKey && deployerKey.trim().length > 0) 
  ? [deployerKey] 
  : [];
// ----------------

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: accounts, // Gunakan variabel yang sudah diamankan
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "",
    },
  },
  sourcify: {
    enabled: true,
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients(); 
  for (const account of accounts) {
    console.log(account.account.address);
  }
});

export default config;