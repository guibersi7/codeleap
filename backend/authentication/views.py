from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.core.exceptions import ValidationError
import logging
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from django.conf import settings

# Configurar logger
logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_view(request):
    """
    View para debug - verificar configurações
    """
    try:
        debug_info = {
            'debug': settings.DEBUG,
            'allowed_hosts': settings.ALLOWED_HOSTS,
            'database_engine': settings.DATABASES['default']['ENGINE'],
            'installed_apps': list(settings.INSTALLED_APPS),
            'middleware': list(settings.MIDDLEWARE),
            'secret_key_configured': bool(settings.SECRET_KEY and settings.SECRET_KEY != 'django-insecure-development-key-change-in-production'),
        }
        
        return Response({
            'success': True,
            'debug_info': debug_info
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Erro no debug view: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    View para login de usuários
    Retorna tokens JWT para autenticação
    """
    try:
        logger.info(f"Tentativa de login com dados: {request.data}")
        
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Atualizar último login
            user.last_login = timezone.now()
            user.save()
            
            # Gerar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            logger.info(f"Login bem-sucedido para usuário: {user.username}")
            
            return Response({
                'success': True,
                'message': 'Login realizado com sucesso',
                'data': {
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                }
            }, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Erro de validação no login: {serializer.errors}")
            return Response({
                'success': False,
                'message': 'Dados inválidos',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Erro interno no login: {str(e)}")
        return Response({
            'success': False,
            'message': 'Erro interno do servidor',
            'error': str(e) if settings.DEBUG else 'Erro interno'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    View para registro de usuários
    """
    try:
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Gerar tokens JWT automaticamente após registro
            refresh = RefreshToken.for_user(user)
            
            logger.info(f"Registro bem-sucedido para usuário: {user.username}")
            
            return Response({
                'success': True,
                'message': 'Usuário registrado com sucesso',
                'data': {
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                }
            }, status=status.HTTP_201_CREATED)
        else:
            logger.warning(f"Erro de validação no registro: {serializer.errors}")
            return Response({
                'success': False,
                'message': 'Dados inválidos',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Erro interno no registro: {str(e)}")
        return Response({
            'success': False,
            'message': 'Erro interno do servidor',
            'error': str(e) if settings.DEBUG else 'Erro interno'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    View para renovar tokens JWT
    """
    try:
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({
                'success': False,
                'message': 'Token de refresh é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar e renovar token
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        
        return Response({
            'success': True,
            'message': 'Token renovado com sucesso',
            'data': {
                'access': access_token
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Erro ao renovar token: {str(e)}")
        return Response({
            'success': False,
            'message': 'Token inválido ou expirado',
            'error': str(e)
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_profile_view(request):
    """
    View para obter perfil do usuário autenticado
    """
    try:
        return Response({
            'success': True,
            'data': UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Erro ao obter perfil: {str(e)}")
        return Response({
            'success': False,
            'message': 'Erro ao obter perfil',
            'error': str(e) if settings.DEBUG else 'Erro interno'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
