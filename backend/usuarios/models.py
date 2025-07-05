from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    cnpj = models.CharField(max_length=18, unique=True)

    def __str__(self):
        return self.cnpj

