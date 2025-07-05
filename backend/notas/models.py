from django.db import models
from django.db import models
from django.conf import settings
import hashlib
from .blockchain import registrar_na_blockchain

class NotaFiscal(models.Model):
    numero = models.CharField(max_length=20)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_emissao = models.DateField()
    hash = models.CharField(max_length=64, blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        dados = f"{self.numero}{self.valor}{self.data_emissao}{self.usuario.cnpj}"
        self.hash = hashlib.sha256(dados.encode()).hexdigest()
        super().save(*args, **kwargs)
       # registrar_na_blockchain(self.hash, self.usuario.cnpj)