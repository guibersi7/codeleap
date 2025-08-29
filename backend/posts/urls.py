from django.urls import path
from django.conf import settings
from . import views

urlpatterns = [
    # GET e POST para /careers/ (lista e criação)
    path('', views.post_list, name='post_list'),
    
    # PATCH e DELETE para /careers/{id}/ (atualização e exclusão)
    path('<int:pk>/', views.post_detail, name='post_detail'),
    
    # Likes
    path('<int:pk>/like/', views.toggle_like, name='toggle_like'),
    
    # Comentários
    path('<int:pk>/comments/', views.comment_list, name='comment_list'),
    path('<int:pk>/comments/<int:comment_pk>/', views.comment_detail, name='comment_detail'),
    
    # Menções
    path('<int:pk>/mentions/', views.mentions_list, name='mentions_list'),
]

# Debug views apenas em desenvolvimento
if settings.DEBUG:
    urlpatterns += [
        path('debug/', views.debug_post, name='debug_post'),
    ] 