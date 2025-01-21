import { ethers } from "hardhat";
import { expect } from "chai";

describe("Add Liquidity", function () {
  let MemeCoin: any;
  let memeCoin: any;
  let owner: any;
  let router: any;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    MemeCoin = await ethers.getContractFactory("MemeCoin");
    [owner] = await ethers.getSigners();

    // Deploy the MemeCoin contract
    memeCoin = await MemeCoin.deploy("TestMemeCoin", "TMC", 1000000);

    // Uniswap V2 Router Address (Example)
    const routerAddress = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
    router = await ethers.getContractAt(
      [
        "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
        "function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)"
      ],
      routerAddress,
      owner
    );
  });

  it("Should add liquidity to Uniswap V2 pool", async function () {
    // Parse amounts as bigint
    const tokenAmount = ethers.parseUnits("1000", 18); // 1000 tokens as bigint
    const ethAmount = ethers.parseEther("1"); // 1 ETH as bigint

    // Approve the router to spend MemeCoin
    await memeCoin.approve(router.target, tokenAmount);

    // Add liquidity
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10); // Deadline is 10 minutes from now
    const tx = await router.addLiquidityETH(
      memeCoin.target, // MemeCoin address
      tokenAmount,
      (tokenAmount * 90n) / 100n, // Min token amount (90%)
      (ethAmount * 90n) / 100n, // Min ETH amount (90%)
      owner.address,
      deadline,
      { value: ethAmount } // Send ETH with the transaction
    );

    // Wait for the transaction to be mined
    await tx.wait();

    // Verify if the liquidity addition was successful
    console.log("Liquidity added successfully!");
  });
});
