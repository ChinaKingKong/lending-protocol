import { ethers } from "hardhat";

async function main() {
  const TARGET_ADDRESS = "0x79E427Ad2933e9a41527Dc967247d590A8f914C1";

  const fs = await import("fs");
  const path = await import("path");
  const deploymentPath = path.join(__dirname, "..", "frontend", "src", "deployment.json");

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const usd8Address = deploymentInfo.contracts.USD8;

  console.log("Checking balances for:", TARGET_ADDRESS);
  console.log("USD8 Token address:", usd8Address);

  const TestToken = await ethers.getContractFactory("TestToken");
  const usd8 = TestToken.attach(usd8Address);

  const balance = await usd8.balanceOf(TARGET_ADDRESS);
  console.log("\nUSD8 Balance:", ethers.formatEther(balance), "USD8");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
