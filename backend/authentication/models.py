from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    """
    Modelo de usuário customizado para autenticação por username
    """
    # Remover campos desnecessários
    email = None
    first_name = None
    last_name = None
    
    # Campos customizados
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text="Username único para login"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Indica se a conta está ativa"
    )
    
    date_joined = models.DateTimeField(
        default=timezone.now,
        help_text="Data de criação da conta"
    )
    
    last_login = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Último login do usuário"
    )
    
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        db_table = "auth_user"
    
    def __str__(self):
        return f"@{self.username}"
    
    def get_full_name(self):
        return f"@{self.username}"
    
    def get_short_name(self):
        return self.username
