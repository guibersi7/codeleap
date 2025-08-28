from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Admin customizado para o modelo User
    """
    list_display = ('username', 'is_active', 'date_joined', 'last_login')
    list_filter = ('is_active', 'date_joined', 'last_login')
    search_fields = ('username',)
    ordering = ('-date_joined',)
    
    # Campos para edição
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Campos para criação
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')
