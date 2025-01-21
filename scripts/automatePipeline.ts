import { deployCoin } from "./deployCoin";
import { addLiquidity } from "./addLiquidity";
import axios from "axios";

// 함수화화
export async function automatePipeline(): Promise<{ memeCoinAddress: string; coinName: string; }> {
  try {
    console.log("Fetching AI-generated trend keyword...");

    // AI 코인 데이터 가져오기
    const { data } = await axios.get("http://localhost:3000/api/getAiCoin");
    const { coinName } = data;

    console.log(`AI-generated Coin: ${coinName}`);

    // Symbol 생성
    const symbol = coinName
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");

    console.log(`Deploying MemeCoin with name "${coinName}" and symbol "${symbol}"`);

    // MemeCoin 배포
    const memeCoinAddress = await deployCoin(coinName, symbol, 1000000);
    console.log(`MemeCoin deployed at address: ${memeCoinAddress}`);

    // 유동성 풀 생성
    console.log(`Adding liquidity to Uniswap for MemeCoin "${coinName}"...`);
    await addLiquidity(memeCoinAddress, 1000, 0.5);
    console.log(`Liquidity pool created successfully for MemeCoin "${coinName}"!`);

    return { memeCoinAddress, coinName };
  } catch (error) {
    console.error("Error in automatePipeline process:", error);
    throw error;
  }
}
