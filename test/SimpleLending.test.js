const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleLending Protocol", function () {
  let usd8, weth, lending;
  let owner, user1, user2;
  let SUPPLY_AMOUNT, BORROW_AMOUNT;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    SUPPLY_AMOUNT = ethers.parseEther("1000");
    BORROW_AMOUNT = ethers.parseEther("500");

    // Deploy TestToken (USD8)
    const TestToken = await ethers.getContractFactory("TestToken");
    usd8 = await TestToken.deploy("USD Stablecoin", "USD8");
    await usd8.waitForDeployment();

    // Deploy TestToken (WETH)
    weth = await TestToken.deploy("Wrapped Ether", "WETH");
    await weth.waitForDeployment();

    // Deploy SimpleLending
    const SimpleLending = await ethers.getContractFactory("SimpleLending");
    lending = await SimpleLending.deploy(await usd8.getAddress());
    await lending.waitForDeployment();

    // Transfer tokens to users
    await usd8.transfer(user1.address, ethers.parseEther("10000"));
    await usd8.transfer(user2.address, ethers.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await lending.token()).to.equal(await usd8.getAddress());
    });

    it("Should have initial rates set", async function () {
      const poolInfo = await lending.getPoolInfo();
      expect(poolInfo.supplyRate).to.equal(2); // 2% base rate
      expect(poolInfo.borrowRate).to.equal(4); // 2% + 2%
    });

    it("Should have zero initial state", async function () {
      const poolInfo = await lending.getPoolInfo();
      expect(poolInfo.totalSupply).to.equal(0);
      expect(poolInfo.totalBorrow).to.equal(0);
      expect(poolInfo.utilizationRate).to.equal(0);
    });
  });

  describe("Supply", function () {
    it("Should allow users to supply tokens", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.supplied).to.equal(SUPPLY_AMOUNT);
      expect(userPosition.borrowed).to.equal(0);
      expect(userPosition.healthFactor).to.equal(ethers.MaxUint256);
    });

    it("Should update pool state after supply", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);

      const poolInfo = await lending.getPoolInfo();
      expect(poolInfo.totalSupply).to.equal(SUPPLY_AMOUNT);
      expect(poolInfo.totalBorrow).to.equal(0);
    });

    it("Should emit Supplied event", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await expect(lending.connect(user1).supply(SUPPLY_AMOUNT))
        .to.emit(lending, "Supplied");
    });

    it("Should revert when supplying zero", async function () {
      await expect(lending.connect(user1).supply(0))
        .to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should revert without approval", async function () {
      await expect(lending.connect(user1).supply(SUPPLY_AMOUNT))
        .to.be.revertedWith("Transfer failed");
    });
  });

  describe("Borrow", function () {
    beforeEach(async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);
    });

    it("Should allow borrowing up to LTV ratio", async function () {
      // 75% LTV of 1000 = 750 max borrow
      const borrowAmount = ethers.parseEther("700");
      await lending.connect(user1).borrow(borrowAmount);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.borrowed).to.equal(borrowAmount);
    });

    it("Should revert when exceeding LTV ratio", async function () {
      const borrowAmount = ethers.parseEther("800"); // Exceeds 75% LTV

      await expect(lending.connect(user1).borrow(borrowAmount))
        .to.be.revertedWith("Exceeds borrowing limit");
    });

    it("Should emit Borrowed event", async function () {
      await expect(lending.connect(user1).borrow(BORROW_AMOUNT))
        .to.emit(lending, "Borrowed");
    });

    it("Should revert when borrowing without collateral", async function () {
      await expect(lending.connect(user2).borrow(BORROW_AMOUNT))
        .to.be.revertedWith("Exceeds borrowing limit");
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);
    });

    it("Should allow withdrawing supplied tokens", async function () {
      const withdrawAmount = ethers.parseEther("500");
      await lending.connect(user1).withdraw(withdrawAmount);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.supplied).to.equal(SUPPLY_AMOUNT - withdrawAmount);
    });

    it("Should allow full withdrawal when no borrow", async function () {
      await lending.connect(user1).withdraw(SUPPLY_AMOUNT);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.supplied).to.equal(0);
    });

    it("Should prevent withdrawal that would make position unhealthy", async function () {
      // Supply 1000, borrow 500 (50% LTV used)
      await lending.connect(user1).borrow(BORROW_AMOUNT);

      // Try to withdraw more than allowed
      const withdrawAmount = ethers.parseEther("400");

      await expect(lending.connect(user1).withdraw(withdrawAmount))
        .to.be.revertedWith("Withdrawal would make position unhealthy");
    });

    it("Should emit Withdrawn event", async function () {
      const withdrawAmount = ethers.parseEther("500");
      await expect(lending.connect(user1).withdraw(withdrawAmount))
        .to.emit(lending, "Withdrawn");
    });
  });

  describe("Repay", function () {
    beforeEach(async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);
      await lending.connect(user1).borrow(BORROW_AMOUNT);
    });

    it("Should allow repaying borrowed tokens", async function () {
      const repayAmount = ethers.parseEther("200");
      await usd8.connect(user1).approve(await lending.getAddress(), repayAmount);
      await lending.connect(user1).repay(repayAmount);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.borrowed).to.equal(BORROW_AMOUNT - repayAmount);
    });

    it("Should allow full repayment", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), BORROW_AMOUNT);
      await lending.connect(user1).repay(BORROW_AMOUNT);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.borrowed).to.equal(0);
      expect(userPosition.healthFactor).to.equal(ethers.MaxUint256);
    });

    it("Should emit Repaid event", async function () {
      const repayAmount = ethers.parseEther("200");
      await usd8.connect(user1).approve(await lending.getAddress(), repayAmount);
      await expect(lending.connect(user1).repay(repayAmount))
        .to.emit(lending, "Repaid");
    });

    it("Should revert when repaying more than borrowed", async function () {
      const repayAmount = ethers.parseEther("1000");
      await usd8.connect(user1).approve(await lending.getAddress(), repayAmount);

      await expect(lending.connect(user1).repay(repayAmount))
        .to.be.revertedWith("Amount exceeds borrow");
    });
  });

  describe("Health Factor", function () {
    it("Should calculate infinite health factor when no borrow", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);

      const userPosition = await lending.getUserPosition(user1.address);
      expect(userPosition.healthFactor).to.equal(ethers.MaxUint256);
    });

    it("Should calculate correct health factor with borrow", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);
      await lending.connect(user1).borrow(BORROW_AMOUNT);

      const userPosition = await lending.getUserPosition(user1.address);
      // Health Factor = (1000 * 0.75 * 100) / 500 = 150
      expect(userPosition.healthFactor).to.equal(150);
    });

    it("Should calculate max borrow correctly", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);

      const maxBorrow = await lending.calculateMaxBorrow(user1.address);
      expect(maxBorrow).to.equal(SUPPLY_AMOUNT * 75n / 100n); // 75% LTV
    });

    it("Should calculate max withdraw correctly", async function () {
      await usd8.connect(user1).approve(await lending.getAddress(), SUPPLY_AMOUNT);
      await lending.connect(user1).supply(SUPPLY_AMOUNT);
      await lending.connect(user1).borrow(BORROW_AMOUNT);

      const maxWithdraw = await lending.calculateMaxWithdraw(user1.address);
      const expected = SUPPLY_AMOUNT - (BORROW_AMOUNT * 100n / 75n);
      expect(maxWithdraw).to.equal(expected);
    });
  });
});
