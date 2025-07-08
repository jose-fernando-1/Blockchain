import json
import hashlib                    
from django.db import models
from django.conf import settings
from django.utils import timezone

class NotaFiscal(models.Model):
    numero = models.CharField(max_length=20, editable=False, unique=True)  # não editável, único
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_emissao = models.DateField(auto_now_add=True)
    hash = models.CharField(max_length=64, blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conteudo = models.JSONField(null=True, blank=True)
    blockchain_tx = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        # Gera número automático só se ainda não tiver
        if not self.numero:
            # Exemplo simples com timestamp, mas pode ser melhorado
            self.numero = f"NF{int(timezone.now().timestamp())}"

        # Gera hash com base no conteúdo JSON, se existir; senão, usa campos antigos
        if self.conteudo:
            conteudo_str = json.dumps(self.conteudo, sort_keys=True)
            self.hash = hashlib.sha256(conteudo_str.encode()).hexdigest()
        else:
            dados = f"{self.numero}{self.valor}{self.data_emissao}{getattr(self.usuario, 'cnpj', '')}"
            self.hash = hashlib.sha256(dados.encode()).hexdigest()

        super().save(*args, **kwargs)
       # registrar_na_blockchain(self.hash, self.usuario.cnpj)