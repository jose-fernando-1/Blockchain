from rest_framework import generics, permissions
from django.http import JsonResponse
from .models import NotaFiscal
from .serializers import NotaFiscalSerializer

class NotaFiscalCreateView(generics.ListCreateAPIView):
    serializer_class = NotaFiscalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NotaFiscal.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

def consultar_nota(request, numero):
    try:
        nota = NotaFiscal.objects.get(numero=numero)
        return JsonResponse({
            "numero": nota.numero,
            "hash": nota.hash,
            "valor": str(nota.valor),
            "data_emissao": nota.data_emissao,
            "usuario": nota.usuario.id,
        })
    except NotaFiscal.DoesNotExist:
        return JsonResponse({"erro": "Nota não encontrada"}, status=404)


