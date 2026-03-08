import json
import os
import hashlib
from datetime import datetime
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def _get_contract():
    # Load contract info
    blockchain_data_dir = os.path.join(os.path.dirname(__file__), "blockchain_data")
    contract_info_path = os.path.join(blockchain_data_dir, "contract_info.json")

    if not os.path.exists(contract_info_path):
        return None

    with open(contract_info_path, "r") as f:
        contract_info = json.load(f)

    return w3.eth.contract(address=contract_info["address"], abi=contract_info["abi"])


def add_verification_record(
    student_id: str, document_number: str, face_score: int, verified: bool
):
    """
    Generate SHA256 of sensitive info and write to Blockchain Ledger.
    """
    contract = _get_contract()
    if not contract:
        print("Blockchain contract not deployed. Skipping blockchain logging.")
        return None

    # Ensure default account has funds (Hardhat account 0)
    w3.eth.default_account = w3.eth.accounts[0]

    # 2. Hashing Identity Data
    # hash = SHA256(student_id + document_number + timestamp)
    timestamp_str = str(int(datetime.utcnow().timestamp()))
    data_to_hash = f"{student_id}{document_number}{timestamp_str}"
    document_hash = hashlib.sha256(data_to_hash.encode("utf-8")).hexdigest()

    # Send transaction
    try:
        tx_hash = contract.functions.addVerificationRecord(
            student_id, document_hash, face_score, verified
        ).transact()

        # Wait for receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return {
            "status": "success",
            "tx_hash": receipt.transactionHash.hex(),
            "student_id": student_id,
        }
    except Exception as e:
        print(f"Error adding verification record: {e}")
        return {"status": "error"}


def get_student_history(student_id: str):
    """
    Fetch history from blockchain given the studentId.
    """
    contract = _get_contract()
    if not contract:
        return []

    try:
        # Call the view function
        history = contract.functions.getStudentHistory(student_id).call()
        formatted_history = []
        for record in history:
            formatted_history.append(
                {
                    "studentId": record[0],
                    "documentHash": record[1],
                    "faceScore": record[2],
                    "verified": record[3],
                    "timestamp": record[4],
                }
            )
        return formatted_history
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []
