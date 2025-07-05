from django.shortcuts import render

from rest_framework import generics, permissions
from .models import NotaFiscal
from .serializers import NotaFiscalSerializer

class NotaFiscalCreateView(generics.ListCreateAPIView):
    serializer_class = NotaFiscalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NotaFiscal.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)