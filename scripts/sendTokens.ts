import { ethers } from "hardhat";

async function main() {
  const TARGET_ADDRESS = "0x79E427Ad2933e9a41527Dc967247d590A8f914C1";
  const AMOUNT = ethers.parseEther("1000000"); // 1,000,000 tokens

  console.log("Sending test tokens to:", TARGET_ADDRESS);
  console.log("Amount:", ethers.formatEther(AMOUNT), "tokens\n");

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Read deployment info
  const fs = await import("fs");
  const path = await import("path");
  const deploymentPath = path.join(__dirname, "..", "frontend", "src", "deployment.json");

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const usd8Address = deploymentInfo.contracts.USD8;

  console.log("\nUSD8 Token address:", usd8Address);

  // Get contract instance
  const TestToken = await ethers.getContractFactory("TestToken");
  const usd8 = TestToken.attach(usd8Address);

  // Check deployer balance
  const deployerBalance = await usd8.balanceOf(deployer.address);
  console.log("\nDeployer balance:", ethers.formatEther(deployerBalance), "USD8");

  // If deployer doesn't have enough, mint tokens
  if (deployerBalance < AMOUNT) {
    const needed = AMOUNT - deployerBalance;
    console.log("\nMinting", ethers.formatEther(needed), "USD8 to deployer...");
    const mintTx = await usd8.mint(deployer.address, needed);
    await mintTx.wait();
    console.log("✓ Minted successfully");
  }

  // Check target current balance
  const currentBalance = await usd8.balanceOf(TARGET_ADDRESS);
  console.log("\nTarget current balance:", ethers.formatEther(currentBalance), "USD8");

  // Send tokens
  console.log("\nSending 1,000,000 USD8...");
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
