import { ethers } from "hardhat";

async function main() {
  const TARGET_ADDRESS = "0x79E427Ad2933e9a41527Dc967247d590A8f914C1";
  const AMOUNT = ethers.parseEther("10000"); // 10,000 tokens

  console.log("Sending test tokens to:", TARGET_ADDRESS);
  console.log("Amount:", ethers.formatEther(AMOUNT), "tokens\n");

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Read deployment info
  const fs = await import("fs");
  const path = await import("path");
  const deploymentPath = path.join(__dirname, "..", "frontend", "src", "deployment.json");

  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found. Please deploy contracts first:");
    console.error("  npx hardhat run scripts/deploy.ts --network localhost");
    return;
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const usd8Address = deploymentInfo.contracts.USD8;

  console.log("\nUSD8 Token address:", usd8Address);

  // Get contract instance
  const TestToken = await ethers.getContractFactory("TestToken");
  const usd8 = TestToken.attach(usd8Address);

  // Check current balance
  const currentBalance = await usd8.balanceOf(TARGET_ADDRESS);
  console.log("\nCurrent balance:", ethers.formatEther(currentBalance), "USD8");

  // Send tokens
  console.log("\nSending 10,000 USD8...");
  const tx = await usd8.transfer(TARGET_ADDRESS, AMOUNT);
  await tx.wait();

  // Verify new balance
  const newBalance = await usd8.balanceOf(TARGET_ADDRESS);
  console.log("\n✓ Tokens sent successfully!");
  console.log("New balance:", ethers.formatEther(newBalance), "USD8");
  console.log("Transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
