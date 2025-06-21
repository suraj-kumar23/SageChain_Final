// scripts/deploy.js

import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy SageToken
  const SageToken = await ethers.getContractFactory("SageToken");
  const sageToken = await SageToken.deploy(1000000);
  await sageToken.deployed();
  console.log("SageToken deployed to:", sageToken.address);

  // Deploy TokenSwap
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy(sageToken.address);
  await tokenSwap.deployed();
  console.log("TokenSwap deployed to:", tokenSwap.address);

  // Transfer 500,000 SAGE to TokenSwap
  const transferTx1 = await sageToken.transfer(
    tokenSwap.address,
    ethers.utils.parseUnits("500000", 18)
  );
  await transferTx1.wait();
  console.log("Transferred 500,000 SAGE to TokenSwap");

  // Transfer 5,000 SAGE to deployer
  const transferTx2 = await sageToken.transfer(
    deployer.address,
    ethers.utils.parseUnits("5000", 18)
  );
  await transferTx2.wait();
  console.log("Transferred 5,000 SAGE to deployer");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
