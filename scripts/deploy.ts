import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy TestToken (USD8)
  console.log("\n1. Deploying TestToken (USD8)...");
  const TestToken = await ethers.getContractFactory("TestToken");
  const usd8 = await TestToken.deploy("USD Stablecoin", "USD8");
  await usd8.waitForDeployment();
  const usd8Address = await usd8.getAddress();
  console.log("   TestToken (USD8) deployed to:", usd8Address);

  // Deploy TestToken (WETH)
  console.log("\n2. Deploying TestToken (WETH)...");
  const weth = await TestToken.deploy("Wrapped Ether", "WETH");
  await weth.waitForDeployment();
  const wethAddress = await weth.getAddress();
  console.log("   TestToken (WETH) deployed to:", wethAddress);

  // Deploy SimpleLending
  console.log("\n3. Deploying SimpleLending...");
  const SimpleLending = await ethers.getContractFactory("SimpleLending");
  const lending = await SimpleLending.deploy(usd8Address);
  await lending.waitForDeployment();
  const lendingAddress = await lending.getAddress();
  console.log("   SimpleLending deployed to:", lendingAddress);

  // Get signers for seeding accounts
  const signers = await ethers.getSigners();
  console.log("\n4. Seeding test accounts with tokens...");

  // Seed each test account with initial tokens
  const seedAmount = ethers.parseEther("10000"); // 10,000 tokens for each account
  for (let i = 1; i < signers.length; i++) {
    const signer = signers[i];
    console.log(`   Seeding ${signer.address}...`);

    // Transfer USD8
    await (await usd8.transfer(signer.address, seedAmount)).wait();
    console.log(`     - Sent 10,000 USD8 to ${signer.address}`);

    // Transfer WETH
    await (await weth.transfer(signer.address, seedAmount)).wait();
    console.log(`     - Sent 10,000 WETH to ${signer.address}`);
  }

  // Get initial pool info
  const poolInfo = await lending.getPoolInfo();
  console.log("\n5. Initial Pool Info:");
  console.log("   Total Supply:", ethers.formatEther(poolInfo[0]), "USD8");
  console.log("   Total Borrow:", ethers.formatEther(poolInfo[1]), "USD8");
  console.log("   Utilization Rate:", poolInfo[2].toString(), "%");
  console.log("   Supply Rate:", poolInfo[3].toString(), "%");
  console.log("   Borrow Rate:", poolInfo[4].toString(), "%");

  console.log("\n=== Deployment Summary ===");
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nDeployed Contracts:");
  console.log("  USD8:", usd8Address);
  console.log("  WETH:", wethAddress);
  console.log("  SimpleLending:", lendingAddress);

  // Write deployment info to file for frontend
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contracts: {
      USD8: usd8Address,
      WETH: wethAddress,
      SimpleLending: lendingAddress,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = path.join(__dirname, "..", "frontend", "src", "deployment.json");
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentPath);

  // Copy ABIs to frontend
  const abiPath = path.join(__dirname, "..", "frontend", "src", "abis");
  fs.mkdirSync(abiPath, { recursive: true });

  // Read ABIs from artifacts
  const artifactsPath = path.join(__dirname, "..", "artifacts", "contracts");

  const testTokenAbi = JSON.parse(
    fs.readFileSync(path.join(artifactsPath, "TestToken.sol", "TestToken.json"), "utf8")
  );
  fs.writeFileSync(
    path.join(abiPath, "TestToken.json"),
    JSON.stringify({ abi: testTokenAbi.abi }, null, 2)
  );

  const lendingAbi = JSON.parse(
    fs.readFileSync(path.join(artifactsPath, "SimpleLending.sol", "SimpleLending.json"), "utf8")
  );
  fs.writeFileSync(
    path.join(abiPath, "SimpleLending.json"),
    JSON.stringify({ abi: lendingAbi.abi }, null, 2)
  );

  console.log("ABIs copied to frontend/src/abis");

  console.log("\n=== Deployment Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
