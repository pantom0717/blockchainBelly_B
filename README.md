app/coins/mintCoin.ts의 경우
script/automatePipeline.ts를 호출해서 코인 이름, 심볼 생성, 코인 배포를 진행하고 정보를 mongoDB에 저장합니다.

app/pricetracker/priceTracker.ts의 경우 블록체인에서 유동성 풀 데이터를 이용해 가격 데이터를 가져옵니다. (시세 추적)

contracts/MemeCoin.sol의 경우 ERC-20 토큰 컨트랙트로 코인 발행을 실제로 하는 컨트랙트 코드입니다. 

scripts/ 
deploycoin.ts : Memcoin 컨트랙트를 배포하고 .env파일에 배포한 컨트랙트 주소를 저장합니다.
addLiquidity.ts : Uniswap V2라는 DEX 거래소를 이용해 유동성 풀을 생성합니다 (코인의 첫 가격 형성)

automatePipeline.ts : 전체 프로세스 자동화 ( AI 데이터를 가져와서 코인을 만들고 유동성 풀을 생성)
 deployCoin.ts, addLiquidity.ts를 호출합니다.

test에 있는 MemeCoinTest.ts, addLiquidityTest.ts는 scripts 파일이 배포됐을떄 이상없는지 hardhat에서 로컬로 테스트한거라
신경안쓰셔도 됩니다.

____________________

env 파일 추가

SEPOLIA_RPC_URL= alchemy에서 sepolia eth 노드 주소 / https://eth-sepolia.g.alchemy.com/v2/ 이런식으로 되어있음
PRIVATE_KEY= 메타마스크 프라이빗 키
UNISWAP_V2_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008