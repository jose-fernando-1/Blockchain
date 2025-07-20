from web3 import Web3
import json
import config

web3 = Web3(Web3.HTTPProvider(config.GANACHE_RPC))

with open(config.CONTRACT_ABI_PATH) as f:
    abi = json.load(f)['abi']

contract = web3.eth.contract(address=config.CONTRACT_ADDRESS, abi=abi)

def get_hash_from_blockchain(numero_nota):
    return contract.functions.getNotaHash(int(numero_nota)).call()
