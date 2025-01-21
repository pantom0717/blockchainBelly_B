import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// MemeCoin 배포 함수
export async function deployCoin(
  coinName: string,
  coinSymbol: string,
  initialSupply: number
): Promise<string> {
  const MemeCoin = await ethers.getContractFactory("MemeCoin");

  console.log(
    `Deploying MemeCoin with name: ${coinName}, symbol: ${coinSymbol}, initial supply: ${initialSupply}`
  );

  const memeCoin = await MemeCoin.deploy(coinName, coinSymbol, initialSupply);
  await memeCoin.deployed();

  console.log(`MemeCoin deployed to: ${memeCoin.address}`);

  // .env 파일 업데이트
  updateEnvFile("CONTRACT_ADDRESS", memeCoin.address);

  return memeCoin.address;
}

// .env 파일 업데이트 함수
function updateEnvFile(key: string, value: string): void {
  const envPath = path.resolve(__dirname, "../.env");
  const newVariable = `${key}=${value}\n`;

  try {
    if (fs.existsSync(envPath)) {
      // 기존 .env 파일 업데이트
      const envContent = fs.readFileSync(envPath, "utf-8");
      const updatedContent = envContent
        .split("\n")
        .filter((line) => !line.startsWith(`${key}=`)) // 동일 키 삭제
        .join("\n")
        .concat(`\n${newVariable}`); // 새 값 추가
      fs.writeFileSync(envPath, updatedContent.trim(), "utf-8");
    } else {
      // .env 파일이 없으면 새로 생성
      fs.writeFileSync(envPath, newVariable, "utf-8");
    }
    console.log(`.env file updated with ${key}: ${value}`);
  } catch (error) {
    console.error("Failed to update .env file:", error);
  }
}

// (테스트용)
if (require.main === module) {
  (async () => {
    try {
      const coinName = "TestMemeCoin";
      const coinSymbol = "TMC";
      const initialSupply = 1000000;

      const deployedAddress = await deployCoin(coinName, coinSymbol, initialSupply);
      console.log(`MemeCoin deployed successfully at address: ${deployedAddress}`);
    } catch (error) {
      console.error("Error deploying MemeCoin:", error);
      process.exitCode = 1;
    }
  })();
}
