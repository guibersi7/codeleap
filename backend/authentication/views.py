from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    View para login de usuários
    Retorna tokens JWT para autenticação
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Atualizar último login
        user.last_login = timezone.now()
        user.save()
        
        # Gerar tokens JWT
        refresh = RefreshToken.for_user(user)
        
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
    
    return Response({
        'success': False,
        'message': 'Dados inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    View para registro de usuários
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Gerar tokens JWT automaticamente após registro
        refresh = RefreshToken.for_user(user)
        
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
    
    return Response({
        'success': False,
        'message': 'Dados inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

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
    return Response({
        'success': True,
        'data': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)
