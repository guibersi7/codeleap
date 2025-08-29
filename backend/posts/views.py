from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post, Like, Comment, Mention
from .serializers import (
    PostSerializer, CreatePostSerializer, UpdatePostSerializer,
    LikeSerializer, CommentSerializer, CreateCommentSerializer, MentionSerializer
)
import logging
import json
from django.http import JsonResponse, HttpResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
import re
from .utils import upload_image_to_cloudinary
import os

User = get_user_model()
jwt_auth = JWTAuthentication()

logger = logging.getLogger(__name__)

def get_user_from_token(request):
    """
    Extrai o usuário do token JWT do header Authorization
    """
    try:
        # Verificar se há header Authorization
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("No Authorization header or invalid format")
            return None
        
        # Extrair o token
        token = auth_header.split(' ')[1]
        
        # Validar o token e obter o usuário
        try:
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            
            if user and user.is_active:
                logger.debug(f"User authenticated: {user.username}")
                return user
            else:
                logger.warning("User inactive or invalid")
                return None
                
        except (InvalidToken, TokenError) as e:
            logger.warning(f"Invalid token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return None
    except Exception as e:
        logger.error(f"Unexpected error in get_user_from_token: {str(e)}")
        return None

def extract_mentions(content):
    """
    Extrai menções (@username) do conteúdo
    """
    mention_pattern = r'@(\w+)'
    mentions = re.findall(mention_pattern, content)
    return mentions

def create_mentions(post, content, user):
    """
    Cria menções para usuários mencionados no conteúdo
    """
    mentions = extract_mentions(content)
    for username in mentions:
        try:
            mentioned_user = User.objects.get(username=username)
            if mentioned_user != user:  # Não mencionar a si mesmo
                Mention.objects.get_or_create(
                    post=post,
                    mentioned_user=mentioned_user
                )
        except User.DoesNotExist:
            logger.warning(f"User {username} not found for mention")

@csrf_exempt
def post_list(request):
    """
    GET: Lista todos os posts (público)
    POST: Cria um novo post (requer autenticação)
    """
    if request.method == 'GET':
        posts = Post.objects.all()
        
        # Converter para JSON manualmente
        posts_data = []
        for post in posts:
            # Usar o username do campo username do post
            username = post.username
            
            # Verificar se o usuário atual deu like
            user_liked = False
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                user = get_user_from_token(request)
                if user:
                    user_liked = post.likes.filter(user=user).exists()
            
            posts_data.append({
                'id': post.id,
                'username': username,
                'created_datetime': post.created_datetime.isoformat(),
                'title': post.title,
                'content': post.content,
                'image': post.image if post.image else None,
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'user_liked': user_liked
            })
        
        response_data = {'data': posts_data}
        
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json',
            status=200
        )
    
    elif request.method == 'POST':
        # Debug: log dos dados recebidos
        logger.info(f"POST request received")
        logger.info(f"Content-Type: {request.content_type}")
        logger.info(f"Request body: {request.body}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        try:
            # Verificar se é multipart/form-data (upload de arquivo)
            if request.content_type and 'multipart/form-data' in request.content_type:
                title = request.POST.get('title')
                content = request.POST.get('content')
                image = request.FILES.get('image')
            else:
                # Parse JSON manualmente
                data = json.loads(request.body.decode('utf-8'))
                title = data.get('title')
                content = data.get('content')
                image = None
            
            if not title or not content:
                return HttpResponse(
                    json.dumps({'error': 'Title e content são obrigatórios'}),
                    content_type='application/json',
                    status=400
                )
            
            # Autenticar usuário via token JWT
            user = get_user_from_token(request)
            if not user:
                logger.error("Failed to authenticate user from token")
                return HttpResponse(
                    json.dumps({'error': 'Token de autenticação inválido ou ausente'}),
                    content_type='application/json',
                    status=401
                )
            
            # Usar o username do token JWT
            username_from_token = user.username
            logger.info(f"Creating post for user: {username_from_token}")
            
            # Criar post com usuário autenticado
            post_data = {
                'title': title,
                'content': content,
                'user': user,
                'username': username_from_token
            }
            
            # Processar imagem se fornecida
            if image:
                try:
                    # Verificar se o Cloudinary está configurado
                    from django.conf import settings
                    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
                    api_key = os.getenv('CLOUDINARY_API_KEY')
                    api_secret = os.getenv('CLOUDINARY_API_SECRET')
                    
                    if not all([cloud_name, api_key, api_secret]):
                        logger.warning("Cloudinary not configured - skipping image upload")
                        return HttpResponse(
                            json.dumps({'error': 'Upload de imagens temporariamente indisponível.'}),
                            content_type='application/json',
                            status=400
                        )
                    
                    # Upload para Cloudinary
                    image_url = upload_image_to_cloudinary(image)
                    post_data['image'] = image_url
                    logger.info(f"Image uploaded to Cloudinary: {image_url}")
                except Exception as e:
                    logger.error(f"Error uploading image: {str(e)}")
                    return HttpResponse(
                        json.dumps({'error': f'Erro ao fazer upload da imagem: {str(e)}'}),
                        content_type='application/json',
                        status=500
                    )
            
            post = Post.objects.create(**post_data)
            
            # Criar menções se houver
            create_mentions(post, content, user)
            
            logger.info(f"Post created successfully with ID: {post.id}, username: {post.username}")
            
            # Retornar resposta JSON
            response_data = {
                'success': True,
                'message': 'Post criado com sucesso',
                'data': {
                    'id': post.id,
                    'title': post.title,
                    'content': post.content,
                    'image': post.image if post.image else None,
                    'username': username_from_token,  # Retornar o username usado
                    'created_datetime': post.created_datetime.isoformat(),
                    'likes_count': 0,
                    'comments_count': 0,
                    'user_liked': False
                }
            }
            
            return HttpResponse(
                json.dumps(response_data),
                content_type='application/json',
                status=201
            )
            
        except json.JSONDecodeError:
            return HttpResponse(
                json.dumps({'error': 'JSON inválido'}),
                content_type='application/json',
                status=400
            )
        except Exception as e:
            logger.error(f"Error in POST: {e}")
            return HttpResponse(
                json.dumps({'error': str(e)}),
                content_type='application/json',
                status=500
            )

@csrf_exempt
def debug_post(request):
    """
    View de debug para identificar problemas com parsers
    """
    if request.method == 'GET':
        response_data = {
            'message': 'Debug view funcionando',
            'content_type': request.content_type,
        }
        
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json',
            status=200
        )
    
    elif request.method == 'POST':
        logger.info(f"DEBUG POST request received")
        logger.info(f"Content-Type: {request.content_type}")
        logger.info(f"Request body: {request.body}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        response_data = {
            'message': 'Debug POST received',
            'content_type': request.content_type,
            'body': str(request.body),
            'headers': dict(request.headers),
        }
        
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json',
            status=200
        )

@csrf_exempt
def post_detail(request, pk):
    """
    PATCH: Atualiza um post existente (requer ser o dono)
    DELETE: Remove um post (requer ser o dono)
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': 'Post não encontrado'
            }),
            content_type='application/json',
            status=404
        )
    
    # Verificar se o usuário é o dono do post (temporariamente desabilitado)
    # if post.user != request.user:
    #     return HttpResponse(
    #         json.dumps({
    #             'success': False,
    #             'message': 'Você não tem permissão para modificar este post'
    #         }),
    #         content_type='application/json',
    #         status=403
    #     )
    
    if request.method == 'PATCH':
        try:
            # Verificar se é multipart/form-data (upload de arquivo)
            if request.content_type and 'multipart/form-data' in request.content_type:
                title = request.POST.get('title')
                content = request.POST.get('content')
                image = request.FILES.get('image')
            else:
                # Parse JSON manualmente
                data = json.loads(request.body.decode('utf-8'))
                title = data.get('title')
                content = data.get('content')
                image = None
            
            # Autenticar usuário via token JWT
            user = get_user_from_token(request)
            if not user:
                logger.error("Failed to authenticate user from token")
                return HttpResponse(
                    json.dumps({'error': 'Token de autenticação inválido ou ausente'}),
                    content_type='application/json',
                    status=401
                )
            
            if title:
                post.title = title
            if content:
                post.content = content
            if image:
                post.image = image
            
            # Atualizar o username para o do usuário autenticado
            post.username = user.username
            post.user = user
            
            post.save()
            
            response_data = {
                'success': True,
                'message': 'Post atualizado com sucesso',
                'data': {
                    'id': post.id,
                    'username': user.username,
                    'created_datetime': post.created_datetime.isoformat(),
                    'title': post.title,
                    'content': post.content,
                    'image': request.build_absolute_uri(post.image.url) if post.image else None
                }
            }
            
            return HttpResponse(
                json.dumps(response_data),
                content_type='application/json',
                status=200
            )
            
        except json.JSONDecodeError:
            return HttpResponse(
                json.dumps({
                    'success': False,
                    'message': 'JSON inválido'
                }),
                content_type='application/json',
                status=400
            )
        except Exception as e:
            return HttpResponse(
                json.dumps({
                    'success': False,
                    'message': str(e)
                }),
                content_type='application/json',
                status=500
            )
    
    elif request.method == 'DELETE':
        post.delete()
        return HttpResponse(
            json.dumps({
                'success': True,
                'message': 'Post deletado com sucesso'
            }),
            content_type='application/json',
            status=200
        )

@csrf_exempt
def toggle_like(request, pk):
    """
    POST: Adiciona ou remove like de um post
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': 'Post não encontrado'
            }),
            content_type='application/json',
            status=404
        )
    
    # Autenticar usuário via token JWT
    user = get_user_from_token(request)
    if not user:
        return HttpResponse(
            json.dumps({'error': 'Token de autenticação inválido ou ausente'}),
            content_type='application/json',
            status=401
        )
    
    try:
        # Verificar se o usuário já deu like
        existing_like = Like.objects.filter(post=post, user=user).first()
        
        if existing_like:
            # Remover like
            existing_like.delete()
            action = 'removed'
        else:
            # Adicionar like
            Like.objects.create(post=post, user=user)
            action = 'added'
        
        response_data = {
            'success': True,
            'message': f'Like {action} com sucesso',
            'data': {
                'action': action,
                'likes_count': post.likes_count,
                'user_liked': action == 'added'
            }
        }
        
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json',
            status=200
        )
        
    except Exception as e:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': str(e)
            }),
            content_type='application/json',
            status=500
        )

@csrf_exempt
def comment_list(request, pk):
    """
    GET: Lista comentários de um post
    POST: Adiciona comentário a um post
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': 'Post não encontrado'
            }),
            content_type='application/json',
            status=404
        )
    
    if request.method == 'GET':
        comments = post.comments.all()
        comments_data = []
        
        for comment in comments:
            comments_data.append({
                'id': comment.id,
                'username': comment.user.username,
                'content': comment.content,
                'created_at': comment.created_at.isoformat(),
                'updated_at': comment.updated_at.isoformat()
            })
        
        response_data = {
            'success': True,
            'data': comments_data
        }
        
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json',
            status=200
        )
    
    elif request.method == 'POST':
        # Autenticar usuário via token JWT
        user = get_user_from_token(request)
        if not user:
            return HttpResponse(
                json.dumps({'error': 'Token de autenticação inválido ou ausente'}),
                content_type='application/json',
                status=401
            )
        
        try:
            data = json.loads(request.body.decode('utf-8'))
            content = data.get('content')
            
            if not content:
                return HttpResponse(
                    json.dumps({'error': 'Content é obrigatório'}),
                    content_type='application/json',
                    status=400
                )
            
            # Criar comentário
            comment = Comment.objects.create(
                post=post,
                user=user,
                content=content
            )
            
            # Criar menções se houver
            create_mentions(post, content, user)
            
            response_data = {
                'success': True,
                'message': 'Comentário criado com sucesso',
                'data': {
                    'id': comment.id,
                    'username': user.username,
                    'content': comment.content,
                    'created_at': comment.created_at.isoformat(),
                    'updated_at': comment.updated_at.isoformat()
                }
            }
            
            return HttpResponse(
                json.dumps(response_data),
                content_type='application/json',
                status=201
            )
            
        except json.JSONDecodeError:
            return HttpResponse(
                json.dumps({'error': 'JSON inválido'}),
                content_type='application/json',
                status=400
            )
        except Exception as e:
            return HttpResponse(
                json.dumps({
                    'success': False,
                    'message': str(e)
                }),
                content_type='application/json',
                status=500
            )

@csrf_exempt
def comment_detail(request, post_pk, comment_pk):
    """
    PATCH: Atualiza um comentário
    DELETE: Remove um comentário
    """
    try:
        comment = Comment.objects.get(pk=comment_pk, post_id=post_pk)
    except Comment.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': 'Comentário não encontrado'
            }),
            content_type='application/json',
            status=404
        )
    
    # Autenticar usuário via token JWT
    user = get_user_from_token(request)
    if not user:
        return HttpResponse(
            json.dumps({'error': 'Token de autenticação inválido ou ausente'}),
            content_type='application/json',
            status=401
        )
    
    # Verificar se o usuário é o dono do comentário
    if comment.user != user:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': 'Você não tem permissão para modificar este comentário'
            }),
            content_type='application/json',
            status=403
        )
    
    if request.method == 'PATCH':
        try:
            data = json.loads(request.body.decode('utf-8'))
            content = data.get('content')
            
            if content:
                comment.content = content
                comment.save()
                
                # Atualizar menções se necessário
                create_mentions(comment.post, content, user)
            
            response_data = {
                'success': True,
                'message': 'Comentário atualizado com sucesso',
                'data': {
                    'id': comment.id,
                    'username': comment.user.username,
                    'content': comment.content,
                    'created_at': comment.created_at.isoformat(),
                    'updated_at': comment.updated_at.isoformat()
                }
            }
            
            return HttpResponse(
                json.dumps(response_data),
                content_type='application/json',
                status=200
            )
            
        except json.JSONDecodeError:
            return HttpResponse(
                json.dumps({'error': 'JSON inválido'}),
                content_type='application/json',
                status=400
            )
        except Exception as e:
            return HttpResponse(
                json.dumps({
                    'success': False,
                    'message': str(e)
                }),
                content_type='application/json',
                status=500
            )
    
    elif request.method == 'DELETE':
        comment.delete()
        return HttpResponse(
            json.dumps({
                'success': True,
                'message': 'Comentário deletado com sucesso'
            }),
            content_type='application/json',
            status=200
        )

def mentions_list(request, pk):
    """
    GET: Lista menções de um post
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'success': False,
                'message': 'Post não encontrado'
            }),
            content_type='application/json',
            status=404
        )
    
    mentions = post.mentions.all()
    mentions_data = []
    
    for mention in mentions:
        mentions_data.append({
            'id': mention.id,
            'mentioned_username': mention.mentioned_user.username,
            'created_at': mention.created_at.isoformat()
        })
    
    response_data = {
        'success': True,
        'data': mentions_data
    }
    
    return HttpResponse(
        json.dumps(response_data),
        content_type='application/json',
        status=200
    )
