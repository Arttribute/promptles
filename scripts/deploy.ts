const hre = require("hardhat");

async function main() {
  const PromptlesLeaderboards = await hre.ethers.getContractFactory(
    "PromptlesLeaderboards"
  );
  const contract = await PromptlesLeaderboards.deploy();
  await contract.waitForDeployment();
  console.log(
    "PromptlesLeaderboards contract deployed to:",
    await contract.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
