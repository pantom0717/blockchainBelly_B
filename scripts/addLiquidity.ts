import { ethers } from "hardhat";

export async function addLiquidity(
  memeCoinAddress: string,
  amountTokenDesired: number,
  ethAmount: number
): Promise<{ tokenPriceInETH: number; txHash: string }> {
  const UNISWAP_V2_ROUTER = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"; // Uniswap V2 Router
  const [signer] = await ethers.getSigners();

  const memeCoin = new ethers.Contract(
    memeCoinAddress,
    ["function approve(address spender, uint256 amount) public returns (bool)"],
    signer
  );

  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    [
      "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
    ],
    signer
  );

  const tokenAmount = ethers.utils.parseUnits(amountTokenDesired.toString(), 18); 
  const ethAmountParsed = ethers.utils.parseEther(ethAmount.toString()); 
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; 
  console.log(`Approving Uniswap Router to spend ${amountTokenDesired} tokens...`);
  await memeCoin.approve(UNISWAP_V2_ROUTER, tokenAmount);

  console.log(`Adding liquidity to Uniswap Pool...`);
  const tx = await router.addLiquidityETH(
    memeCoinAddress,
    tokenAmount,
    tokenAmount.mul(90).div(100), // 최소 토큰 수량 (90% 허용)
    ethAmountParsed.mul(90).div(100), // 최소 ETH 수량 (90% 허용)
    signer.address, // 수익자 주소
    deadline,
    { value: ethAmountParsed } // 보내는 ETH 값
  );

  console.log("Transaction sent. Waiting for confirmation...");
  await tx.wait();
  console.log(`Liquidity added successfully. Tx: ${tx.hash}`);

  // 초기 가격 계산
  const tokenPriceInETH = parseFloat(ethers.utils.formatEther(ethAmountParsed)) / amountTokenDesired;

  // 반환값: 초기 가격과 트랜잭션 해시
  return { tokenPriceInETH, txHash: tx.hash };
}

// 테스트용 
async function main() {
  const memeCoinAddress = "0xYourMemeCoinAddress"; // 배포된 MemeCoin 주소
  const amountTokenDesired = 1000; // 토큰 수량
  const ethAmount = 0.5; // ETH 수량

  const { tokenPriceInETH, txHash } = await addLiquidity(memeCoinAddress, amountTokenDesired, ethAmount);

  console.log(`Initial price (1 token in ETH): ${tokenPriceInETH}`);
  console.log(`Transaction hash: ${txHash}`);
}

main().catch((error) => {
  console.error("Error adding liquidity:", error);
  process.exitCode = 1;
});
