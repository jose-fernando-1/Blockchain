# backend/notas/blockchain_service.py

import json
from web3 import Web3
from django.conf import settings
import logging

# Configura um logger para registrar informações e erros
logger = logging.getLogger(__name__)

def registrar_hash_na_blockchain(nf_hash: str) -> str:
    """
    Conecta-se ao nó Ganache, chama o smart contract e registra o hash.
    Retorna o hash da transação (tx_hash) em caso de sucesso.
    """
    try:
        # 1. Conecta-se ao nó Ganache usando a URL das configurações
        w3 = Web3(Web3.HTTPProvider(settings.GANACHE_URL))
        if not w3.is_connected():
            logger.error("Blockchain Service: Não foi possível conectar ao nó Ganache.")
            return ""

        # 2. Carrega o Smart Contract
        # Converte o endereço para o formato que a web3 espera
        contract_address = Web3.to_checksum_address(settings.SMART_CONTRACT_ADDRESS)
        # Carrega o ABI a partir da string JSON nas configurações
        contract_abi = json.loads(settings.SMART_CONTRACT_ABI)
        contract = w3.eth.contract(address=contract_address, abi=contract_abi)

        # 3. Prepara e envia a transação
        # Define a conta que pagará pelo "gás" (custo da transação).
        # Em Ganache, a primeira conta (índice 0) é usada por padrão.
        w3.eth.default_account = w3.eth.accounts[0]

        # Chama a função 'adicionarHash' do nosso contrato, passando o hash da NF
        tx_hash = contract.functions.adicionarHash(nf_hash).transact()

        # Espera a transação ser minerada e incluída em um bloco
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        logger.info(f"Hash {nf_hash[:10]}... registrado com sucesso no bloco {receipt.blockNumber}.")

        # Retorna o hash da transação como uma string hexadecimal
        return tx_hash.hex()

    except Exception as e:
        logger.error(f"Blockchain Service: Erro ao registrar hash na blockchain: {e}")
        return "" # Retorna vazio em caso de erro