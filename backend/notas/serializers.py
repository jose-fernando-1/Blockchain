from rest_framework import serializers
from .models import NotaFiscal

class NotaFiscalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotaFiscal
        fields = ['id', 'numero', 'valor', 'data_emissao', 'hash']
        read_only_fields = ['hash']