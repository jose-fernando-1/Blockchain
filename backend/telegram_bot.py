# telegram_bot.py
import os
import django
import json
import hashlib
import asyncio
from django.db import transaction

# Carrega as configurações e o ambiente do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') 
django.setup()

# Agora podemos importar os models do Django
from notas.models import NotaFiscal

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Token que você recebeu do BotFather
TELEGRAM_TOKEN = "8394798033:AAHKxsraujGIzY3KdMfhLdNN8RsA7hH5Ors"

# Função para o comando /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        'Olá! Sou um bot para verificar a integridade de Notas Fiscais.\n'
        'Envie o número de uma nota para começar.'
    )

# Função para lidar com as mensagens que não são comandos
async def verificar_nota(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    numero_nf = update.message.text
    
    try:
        # --- INÍCIO DA CORREÇÃO ---

        # 1. Definimos uma função síncrona interna para fazer o trabalho do banco de dados.
        @transaction.atomic
        def get_nota_from_db():
            # Esta chamada síncrona agora está encapsulada.
            return NotaFiscal.objects.get(numero=numero_nf)

        # 2. Usamos asyncio.to_thread para executar a função síncrona em uma 
        #    thread separada, sem bloquear o loop principal do bot.
        nota = await asyncio.to_thread(get_nota_from_db)
        
        # --- FIM DA CORREÇÃO ---
        
        # 2. Recalcula o hash a partir do conteúdo JSON salvo
        conteudo_str = json.dumps(nota.conteudo, sort_keys=True)
        hash_recalculado = hashlib.sha256(conteudo_str.encode()).hexdigest()
        
        # 3. Compara o hash salvo com o recalculado
        hash_salvo = nota.hash
        
        # Monta a resposta
        mensagem = f"🔍 **Verificação da Nota Fiscal:** `{nota.numero}`\n\n"
        mensagem += f"**Conteúdo da Nota:**\n```json\n{json.dumps(nota.conteudo, indent=2)}\n```\n\n"
        
        if hash_salvo == hash_recalculado:
            mensagem += "✅ **INTEGRIDADE CONFIRMADA**\n"
            mensagem += "O conteúdo da nota corresponde ao hash registrado na blockchain.\n\n"
        else:
            mensagem += "❌ **ALERTA: DADOS INCONSISTENTES!**\n"
            mensagem += "O conteúdo atual da nota NÃO corresponde ao hash original.\n\n"
            
        mensagem += f"🔗 **Hash Registrado:** `{hash_salvo}`"

        await update.message.reply_text(mensagem, parse_mode='Markdown')

    except NotaFiscal.DoesNotExist:
        await update.message.reply_text(f"Desculpe, a nota fiscal com o número '{numero_nf}' não foi encontrada.")
    except Exception as e:
        await update.message.reply_text(f"Ocorreu um erro ao processar sua solicitação: {e}")

def main() -> None:
    """Inicia o bot."""
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    # Adiciona os handlers para os comandos e mensagens
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, verificar_nota))

    # Inicia o bot (ele fica rodando e esperando por mensagens)
    print("Bot do Telegram iniciado...")
    application.run_polling()

if __name__ == '__main__':
    main()
