import { ethers } from "hardhat";

async function main() {
  const TARGET_ADDRESS = "0x79E427Ad2933e9a41527Dc967247d590A8f914C1";
  const AMOUNT = ethers.parseEther("10"); // 10 ETH

  console.log("Sending test ETH to:", TARGET_ADDRESS);
  console.log("Amount:", ethers.formatEther(AMOUNT), "ETH\n");

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Check current balance
  const currentBalance = await ethers.provider.getBalance(TARGET_ADDRESS);
  console.log("\nCurrent balance:", ethers.formatEther(currentBalance), "ETH");

  // Send ETH
  console.log("\nSending 10 ETH...");
  const tx = await deployer.sendTransaction({
    to: TARGET_ADDRESS,
    value: AMOUNT,
  });
  await tx.wait();

  // Verify new balance
  const newBalance = await ethers.provider.getBalance(TARGET_ADDRESS);
  console.log("\n✓ ETH sent successfully!");
  console.log("New balance:", ethers.formatEther(newBalance), "ETH");
  console.log("Transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
