from rest_framework import serializers
from .models import NotaFiscal

class NotaFiscalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotaFiscal
        fields = ['id', 'numero', 'conteudo', 'valor', 'data_emissao', 'blockchain_tx']
        read_only_fields = ['numero', 'data_emissao', 'blockchain_tx']
