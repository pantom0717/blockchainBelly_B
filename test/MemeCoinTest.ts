import { ethers } from "hardhat";
import { expect } from "chai";

describe("MemeCoin", function () {
  let MemeCoin: any;
  let memeCoin: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    MemeCoin = await ethers.getContractFactory("MemeCoin"); // MemeCoin 컨트랙트 팩토리 가져오기
    [owner, addr1, addr2] = await ethers.getSigners(); // 계정 가져오기

    // Deploy the contract
    memeCoin = await MemeCoin.deploy("TestMemeCoin", "TMC", 1000000); // 컨트랙트 배포
  });

  it("Should assign the initial supply to the owner", async function () {
    const ownerBalance = await memeCoin.balanceOf(owner.address); // 소유자 잔액 확인
    expect(await memeCoin.totalSupply()).to.equal(ownerBalance); // 초기 공급량이 소유자 잔액과 동일한지 확인
  });

  it("Should allow the owner to mint new tokens", async function () {
    const mintAmount = ethers.parseUnits("1000", 18); // 민팅할 토큰 양
    await memeCoin.mint(addr1.address, mintAmount); // addr1에 토큰 민팅

    const addr1Balance = await memeCoin.balanceOf(addr1.address); // addr1의 잔액 확인
    expect(addr1Balance).to.equal(mintAmount); // 민팅한 양이 올바르게 추가되었는지 확인
  });

  it("Should fail if a non-owner tries to mint tokens", async function () {
    const mintAmount = ethers.parseUnits("1000", 18); // 민팅할 토큰 양
    await expect(memeCoin.connect(addr1).mint(addr2.address, mintAmount)) // 소유자가 아닌 addr1이 민팅을 시도
      .to.be.revertedWith("Only owner can mint"); // 실패해야 하며 오류 메시지가 "Only owner can mint"인지 확인
  });

  it("Should return the correct name and symbol", async function () {
    expect(await memeCoin.name()).to.equal("TestMemeCoin"); // 이름 확인
    expect(await memeCoin.symbol()).to.equal("TMC"); // 심볼 확인
  });

  it("Should transfer tokens between accounts", async function () {
    const transferAmount = ethers.parseUnits("500", 18); // 전송할 토큰 양

    // Transfer tokens from owner to addr1
    await memeCoin.transfer(addr1.address, transferAmount); // 소유자에서 addr1로 토큰 전송
    expect(await memeCoin.balanceOf(addr1.address)).to.equal(transferAmount); // addr1 잔액 확인

    // Transfer tokens from addr1 to addr2
    await memeCoin.connect(addr1).transfer(addr2.address, transferAmount); // addr1에서 addr2로 토큰 전송
    expect(await memeCoin.balanceOf(addr2.address)).to.equal(transferAmount); // addr2 잔액 확인
  });

  it("Should fail if sender doesn't have enough balance", async function () {
    const transferAmount = ethers.parseUnits("1000", 18); // 전송할 토큰 양

    // Try to transfer more tokens than available
    await expect(
      memeCoin.connect(addr1).transfer(addr2.address, transferAmount) // 잔액보다 많은 토큰 전송 시도
    ).to.be.reverted; // 실패해야 하며 오류 메시지가 맞는지 확인
  });
});0
