import { connectDB } from "@/database";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

// 가격 조회 
async function fetchPrice(pairAddress: string): Promise<number> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, provider);

    // 유동성 풀의 리저브 정보 가져오기
    const [reserve0, reserve1] = await pairContract.getReserves();
    return Number(reserve1) / Number(reserve0); // 
  } catch (error) {
    console.error("Error fetching price:", error);
    throw new Error("Failed to fetch price");
  }
}

// POST: MongoDB에 시세 데이터 저장
export async function POST(req: Request) {
  try {
    const { pairAddress, coinId } = await req.json();

    if (!pairAddress || !coinId) {
      return NextResponse.json({ error: "pairAddress and coinId are required" }, { status: 400 });
    }

    const price = await fetchPrice(pairAddress);

    const db = (await connectDB).db("postings");
    const result = await db.collection("prices").insertOne({
      coinId,
      pairAddress,
      price,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving price:", error);
    return NextResponse.json({ error: "Failed to save price" }, { status: 500 });
  }
}

// MongoDB에서 특정 코인의 시세 GET으로 조회
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const coinId = searchParams.get("coinId");

    if (!coinId) {
      return NextResponse.json({ error: "coinId is required" }, { status: 400 });
    }

    const db = (await connectDB).db("postings");
    const prices = await db.collection("prices").find({ coinId }).sort({ timestamp: -1 }).toArray();

    return NextResponse.json(prices);
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
