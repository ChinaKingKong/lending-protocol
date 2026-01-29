import { ethers } from "hardhat";

async function main() {
  const USER_ADDRESS = "0x79E427Ad2933e9a41527Dc967247d590A8f914C1";

  const fs = await import("fs");
  const path = await import("path");
  const deploymentPath = path.join(__dirname, "..", "frontend", "src", "deployment.json");

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const lendingAddress = deploymentInfo.contracts.SimpleLending;
  const usd8Address = deploymentInfo.contracts.USD8;

  console.log("Checking position for:", USER_ADDRESS);
  console.log("Lending address:", lendingAddress);
  console.log("USD8 address:", usd8Address);

  const lendingAbi = JSON.parse(fs.readFileSync(
    path.join(__dirname, "..", "artifacts", "contracts", "SimpleLending.sol", "SimpleLending.json"),
    "utf8"
  ));

  const lending = new ethers.Contract(lendingAddress, lendingAbi.abi, (await ethers.getSigners())[0]);

  // Check user supply and borrow directly
  const userSupply = await lending.userSupply(USER_ADDRESS);
  const userBorrow = await lending.userBorrow(USER_ADDRESS);

  console.log("\n=== Direct State ===");
  console.log("userSupply:", ethers.formatEther(userSupply), "USD8");
  console.log("userBorrow:", ethers.formatEther(userBorrow), "USD8");

  // Check getUserPosition
  const position = await lending.getUserPosition(USER_ADDRESS);
  console.log("\n=== getUserPosition ===");
  console.log("supplied:", ethers.formatEther(position.supplied), "USD8");
  console.log("borrowed:", ethers.formatEther(position.borrowed), "USD8");
  console.log("healthFactor:", position.healthFactor.toString());

  // Check calculateMaxWithdraw
  const maxWithdraw = await lending.calculateMaxWithdraw(USER_ADDRESS);
  console.log("\n=== calculateMaxWithdraw ===");
  console.log("maxWithdraw:", ethers.formatEther(maxWithdraw), "USD8");

  // Check calculateMaxBorrow
  const maxBorrow = await lending.calculateMaxBorrow(USER_ADDRESS);
  console.log("\n=== calculateMaxBorrow ===");
  console.log("maxBorrow:", ethers.formatEther(maxBorrow), "USD8");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
