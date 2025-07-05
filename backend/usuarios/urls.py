from django.urls import path
from .views import UsuarioCreateView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', UsuarioCreateView.as_view()),
    path('login/', obtain_auth_token),
]
