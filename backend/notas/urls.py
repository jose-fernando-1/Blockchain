from django.urls import path
from .views import NotaFiscalCreateView, consultar_nota


urlpatterns = [
    path('notas/', NotaFiscalCreateView.as_view()),
    path('notas/<str:numero>/', consultar_nota),
]
