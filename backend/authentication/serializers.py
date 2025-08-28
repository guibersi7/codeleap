from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para exibição de usuários
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']

class LoginSerializer(serializers.Serializer):
    """
    Serializer para login de usuários
    """
    username = serializers.CharField(
        max_length=150,
        help_text="Username para login"
    )
    
    def validate(self, attrs):
        username = attrs.get('username')
        
        if username:
            # Verificar se o usuário existe
            try:
                user = User.objects.get(username=username)
                if not user.is_active:
                    raise serializers.ValidationError("Conta desativada.")
            except User.DoesNotExist:
                # Criar usuário automaticamente se não existir
                user = User.objects.create_user(username=username)
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Username é obrigatório.")

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de usuários
    """
    class Meta:
        model = User
        fields = ['username']
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username já existe.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username']
        )
        return user 