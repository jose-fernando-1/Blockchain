import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
DJANGO_API_URL = os.getenv("DJANGO_API_URL")  # ex: http://localhost:8000/api/notas/
GANACHE_RPC = os.getenv("GANACHE_RPC")        # ex: http://127.0.0.1:7545
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
CONTRACT_ABI_PATH = os.getenv("CONTRACT_ABI_PATH")  # ex: ./blockchain/artifacts/Nota.json
