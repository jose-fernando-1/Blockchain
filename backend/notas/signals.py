# backend/notas/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import NotaFiscal
from .blockchain_service import registrar_hash_na_blockchain

@receiver(post_save, sender=NotaFiscal)
def registrar_hash_blockchain_apos_salvar(sender, instance, created, **kwargs):
    """
    Este sinal é acionado após uma NotaFiscal ser salva.
    Se for uma nova nota (created=True) e ainda não tiver um tx_hash,
    ele tentará registrar o hash na blockchain.
    """
    if created and instance.hash and not instance.blockchain_tx:
        print(f"Sinal recebido! Registrando hash da NF {instance.numero} na blockchain...")
        tx_hash = registrar_hash_na_blockchain(instance.hash)
        
        if tx_hash:
            # Salva o hash da transação de volta no modelo,
            # mas usando .update() para não disparar o sinal novamente e criar um loop.
            NotaFiscal.objects.filter(pk=instance.pk).update(blockchain_tx=tx_hash)
            print(f"Hash da NF {instance.numero} registrado com sucesso! TX: {tx_hash}")