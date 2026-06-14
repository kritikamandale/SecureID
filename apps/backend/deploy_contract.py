import json
import os
import sys
from web3 import Web3

# Connect to local Hardhat node
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

if not w3.is_connected():
    print(
        "Failed to connect to local Hardhat node on port 8545. Make sure 'npx hardhat node' is running."
    )
    sys.exit(1)

# Set the default account (Hardhat provides 20 accounts by default)
w3.eth.default_account = w3.eth.accounts[0]

# Path to the compiled contract artifact
current_dir = os.path.dirname(os.path.abspath(__file__))
artifact_path = os.path.join(
    os.path.dirname(current_dir),
    "blockchain",
    "artifacts",
    "contracts",
    "StudentVerificationLedger.sol",
    "StudentVerificationLedger.json",
)

with open(artifact_path, "r") as f:
    contract_json = json.load(f)

abi = contract_json["abi"]
bytecode = contract_json["bytecode"]

# Create the contract factory
Ledger = w3.eth.contract(abi=abi, bytecode=bytecode)

print("Deploying StudentVerificationLedger...")
# Submit the transaction to deploy the contract
tx_hash = Ledger.constructor().transact()

# Wait for the transaction to be mined
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

contract_address = tx_receipt.contractAddress
print(f"Contract deployed successfully at address: {contract_address}")

# Save the address and ABI for the FastAPI app to use
blockchain_data_dir = os.path.join(os.path.dirname(__file__), "app", "blockchain_data")
os.makedirs(blockchain_data_dir, exist_ok=True)

contract_info = {"address": contract_address, "abi": abi}

with open(os.path.join(blockchain_data_dir, "contract_info.json"), "w") as f:
    json.dump(contract_info, f, indent=4)

print("Contract info saved to app/blockchain_data/contract_info.json")
