import { NextResponse } from "next/server";
import { automatePipeline } from "@/scripts/automatePipeline";
import { connectDB } from "@/database";

// POST: 새 코인 생성 및 블록체인 발행
export async function POST() {
  try {
    console.log("Starting coin creation process...");

    // 자동화 파이프라인 실행
    const { memeCoinAddress, coinName } = await automatePipeline();

    // MongoDB에 저장
    const client = await connectDB;
    const db = client.db("postings");

    const newCoin = {
      coinName,
      contractAddress: memeCoinAddress,
      createdAt: new Date(),
    };

    const result = await db.collection("coins").insertOne(newCoin);

    console.log("Coin creation process completed successfully!");

    return NextResponse.json({
      message: "Coin created and liquidity pool added successfully",
      coinId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating coin:", error);
    return NextResponse.json({ error: "Failed to create coin" }, { status: 500 });
  }
}
