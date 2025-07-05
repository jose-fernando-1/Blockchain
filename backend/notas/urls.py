from django.urls import path
from .views import NotaFiscalCreateView

urlpatterns = [
    path('notas/', NotaFiscalCreateView.as_view()),
]
