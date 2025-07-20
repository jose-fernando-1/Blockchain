import requests
import config

def fetch_nota(numero):
    response = requests.get(f"{config.DJANGO_API_URL}{numero}/")
    if response.status_code == 200:
        return response.json()
    return None
