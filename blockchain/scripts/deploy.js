const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Ledger = await hre.ethers.getContractFactory(
    "StudentVerificationLedger",
  );
  const ledger = await Ledger.deploy();

  await ledger.waitForDeployment();
  const address = await ledger.getAddress();

  console.log(`StudentVerificationLedger deployed to ${address}`);

  // Save the address and ABI to the backend directory for easy access
  const contractInfo = {
    address: address,
    abi: ledger.interface.formatJson(),
  };

  const outputDir = path.join(
    __dirname,
    "..",
    "..",
    "backend",
    "app",
    "blockchain_data",
  );
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "contract_info.json"),
    JSON.stringify(contractInfo, null, 2),
  );
  console.log("Contract info exported to backend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
