from web3 import Web3

def registrar_na_blockchain(nf_hash, cnpj):
    # Conecta à rede Mumbai (Polygon testnet)
    w3 = Web3(Web3.HTTPProvider('https://rpc-mumbai.maticvigil.com'))

    # Endereço do contrato já implantado (você precisa substituir)
    contrato_endereco = Web3.to_checksum_address('0xSEU_CONTRATO')

    # ABI do contrato (definida no deploy ou copiada do Remix/Hardhat)
    with open('caminho_para_ABI/abi.json') as f:
        abi = json.load(f)

    contrato = w3.eth.contract(address=contrato_endereco, abi=abi)

    # Chave privada da carteira que vai assinar a transação (use .env!)
    private_key = os.getenv("PRIVATE_KEY")
    public_address = w3.eth.account.privateKeyToAccount(private_key).address

    # Prepara transação
    nonce = w3.eth.get_transaction_count(public_address)
    gas_price = w3.eth.gas_price

    tx = contrato.functions.storeNota(nf_hash, cnpj).build_transaction({
        'from': public_address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': gas_price,
        'chainId': 80001  # ID da rede Mumbai
    })

    # Assina e envia
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    print(f'Transação enviada! Hash: {w3.to_hex(tx_hash)}')
    return w3.to_hex(tx_hash)