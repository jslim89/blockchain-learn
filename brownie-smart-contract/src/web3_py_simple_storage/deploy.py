from solcx import compile_standard, install_solc
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv('.env')
chain_id = int(os.getenv('CHAIN_ID'))
my_address = os.getenv('OWNER_ADDRESS')
private_key = os.getenv('PRIVATE_KEY')
solidity_version = os.getenv('SOLC_VERSION')
install_solc(solidity_version)

with open('./SimpleStorage.sol', 'r') as file:
    simple_storage_file = file.read();

compiled_sol = compile_standard({
    'language': 'Solidity',
    'sources': {
        'SimpleStorage.sol': { 'content': simple_storage_file }
    },
    'settings': {
        'outputSelection': {
            '*': {
                '*': ['abi', 'metadata', 'evm.bytecode', 'evm.sourceMap']
            }
        }
    },
}, solc_version=solidity_version)


bytecode = compiled_sol['contracts']['SimpleStorage.sol']['SimpleStorage']['evm']['bytecode']['object']

abi = compiled_sol['contracts']['SimpleStorage.sol']['SimpleStorage']['abi']

w3 = Web3(Web3.HTTPProvider(os.getenv('WEB3_ENDPOINT')))

SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)

nonce = w3.eth.getTransactionCount(my_address)

transaction = SimpleStorage.constructor().buildTransaction(
    {'gasPrice': w3.eth.gas_price, 'chainId': chain_id, 'from': my_address, 'nonce': nonce}
)
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

simple_storage = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

# initial value of favouriteNumber
print(simple_storage.functions.retrieve().call())
store_transaction = simple_storage.functions.store(15).buildTransaction(
    {'gasPrice': w3.eth.gas_price, 'chainId': chain_id, 'from': my_address, 'nonce': nonce + 1}
)
signed_store_txn = w3.eth.account.sign_transaction(store_transaction, private_key=private_key)
tx_hash_store = w3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash_store)