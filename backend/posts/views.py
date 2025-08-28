from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer, CreatePostSerializer, UpdatePostSerializer

@api_view(['GET', 'POST'])
@permission_classes([AllowAny if 'GET' else IsAuthenticated])
def post_list(request):
    """
    GET: Lista todos os posts (público)
    POST: Cria um novo post (requer autenticação)
    """
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response({'data': serializer.data})
    
    elif request.method == 'POST':
        serializer = CreatePostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save()
            response_serializer = PostSerializer(post)
            return Response({'data': response_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def post_detail(request, pk):
    """
    PATCH: Atualiza um post existente (requer ser o dono)
    DELETE: Remove um post (requer ser o dono)
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Post não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Verificar se o usuário é o dono do post
    if post.user != request.user:
        return Response({
            'success': False,
            'message': 'Você não tem permissão para modificar este post'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'PATCH':
        serializer = UpdatePostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response_serializer = PostSerializer(post)
            return Response({
                'success': True,
                'message': 'Post atualizado com sucesso',
                'data': response_serializer.data
            })
        return Response({
            'success': False,
            'message': 'Dados inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        post.delete()
        return Response({
            'success': True,
            'message': 'Post deletado com sucesso'
        }, status=status.HTTP_200_OK)
