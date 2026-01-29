import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Seeding accounts with tokens...");
  console.log("Deployer address:", deployer.address);

  // Read deployment info
  const deploymentPath = path.join(__dirname, "..", "frontend", "src", "deployment.json");

  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const usd8Address = deployment.contracts.USD8;
  const wethAddress = deployment.contracts.WETH;

  // Get contract instances
  const TestToken = await ethers.getContractFactory("TestToken");
  const usd8 = TestToken.attach(usd8Address);
  const weth = TestToken.attach(wethAddress);

  // Get signers
  const signers = await ethers.getSigners();
  const seedAmount = ethers.parseEther("10000");

  console.log("\nSeeding test accounts...");
  for (let i = 1; i < signers.length; i++) {
    const signer = signers[i];
    console.log(`\nAccount ${i}: ${signer.address}`);

    const usd8Balance = await usd8.balanceOf(signer.address);
    const wethBalance = await weth.balanceOf(signer.address);

    console.log(`  USD8 Balance: ${ethers.formatEther(usd8Balance)}`);
    console.log(`  WETH Balance: ${ethers.formatEther(wethBalance)}`);

    if (usd8Balance < seedAmount) {
      const amountToSeed = seedAmount - usd8Balance;
      await (await usd8.transfer(signer.address, amountToSeed)).wait();
      console.log(`  Seeded ${ethers.formatEther(amountToSeed)} USD8`);
    }

    if (wethBalance < seedAmount) {
      const amountToSeed = seedAmount - wethBalance;
      await (await weth.transfer(signer.address, amountToSeed)).wait();
      console.log(`  Seeded ${ethers.formatEther(amountToSeed)} WETH`);
    }
  }

  console.log("\n=== Seeding Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
