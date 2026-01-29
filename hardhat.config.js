require("@nomicfoundation/hardhat-ethers");
require("@typechain/hardhat");
require("dotenv").config();

// Sepolia RPC：从 .env 读取，或使用公共节点
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://rpc.sepolia.org";

// 仅当会用到 sepolia 时打印当前 RPC 主机（便于确认 .env 是否生效）
if (process.argv.includes("--network") && process.argv.includes("sepolia") && !process.argv.includes("sepolia_alt")) {
  try {
    console.log("[Sepolia RPC] 当前使用:", new URL(SEPOLIA_RPC_URL).hostname);
  } catch (e) {
    console.warn("[Sepolia RPC] URL 无效:", SEPOLIA_RPC_URL);
  }
}

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      timeout: 90000, // 90 秒，公网 RPC 可能较慢
    },
    // 备用 RPC（Alchemy 连不上时用，如国内网络）：任选其一试
    // 试: npx hardhat run scripts/deploy.ts --network sepolia_alt
    sepolia_alt: {
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      timeout: 90000,
    },
    // 若 sepolia_alt 也超时，试: --network sepolia_alt2
    sepolia_alt2: {
      url: "https://sepolia.drpc.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      timeout: 90000,
    },
    sepolia_alt3: {
      url: "https://1rpc.io/sepolia",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      timeout: 90000,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "./frontend/src/types",
    target: "ethers-v6",
  },
};
