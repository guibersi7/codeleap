from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Debug
    path('debug/', views.debug_view, name='debug'),
    
    # Login e registro
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    
    # Tokens
    path('refresh/', views.refresh_token_view, name='refresh_token'),
    path('verify/', views.verify_token_view, name='verify_token'),
    
    # Perfil do usuário
    path('profile/', views.user_profile_view, name='user_profile'),
] 