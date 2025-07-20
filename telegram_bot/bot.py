from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import requests
from web3 import Web3
import json
import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
DJANGO_API_URL = os.getenv("DJANGO_API_URL")  # ex: http://localhost:8000/notas/
GANACHE_RPC = os.getenv("GANACHE_RPC")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
ABI_PATH = os.getenv("CONTRACT_ABI_PATH")

# Conexão Web3
web3 = Web3(Web3.HTTPProvider(GANACHE_RPC))
with open(ABI_PATH) as f:
    abi = json.load(f)['abi']
contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Olá! Envie /verificar <numero_nota> para validar.")

async def verificar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) != 1:
        return await update.message.reply_text("Uso: /verificar NF<numero>")

    numero = context.args[0]

    # Pegar nota via Django
    try:
        response = requests.get(f"{DJANGO_API_URL}{numero}/")
        data = response.json()
        hash_nota = data['hash']
    except:
        return await update.message.reply_text("❌ Nota não encontrada no sistema.")

    # Verificar se hash está na blockchain
    total = contract.functions.totalHashes().call()
    hashes = [contract.functions.hashes(i).call() for i in range(total)]

    if hash_nota in hashes:
        await update.message.reply_text("✅ Nota válida! Hash presente na blockchain.")
    else:
        await update.message.reply_text("⚠️ Nota não verificada! Hash não encontrado na blockchain.")

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("verificar", verificar))
    app.run_polling()
