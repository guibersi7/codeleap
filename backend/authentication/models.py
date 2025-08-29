from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('Username é obrigatório')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(username, password, **extra_fields)

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
    
    objects = UserManager()
    
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
    

