const hre = require("hardhat");

async function main() {
  console.log("Deploying CharityConnectLedger contract...");

  // 1. Get contract factory
  const CharityConnectLedger = await hre.ethers.getContractFactory("CharityConnectLedger");

  // 2. Deploy
  const contract = await CharityConnectLedger.deploy();

  // 3. Wait for deployment
  await contract.waitForDeployment(); // v6 replacement for .deployed()

  // 4. Get the address
  const deployedAddress = await contract.getAddress(); // returns string

  console.log("CharityConnectLedger deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
