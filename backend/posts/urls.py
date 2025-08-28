from django.urls import path
from . import views

urlpatterns = [
    # GET e POST para /careers/ (lista e criação)
    path('', views.post_list, name='post_list'),
    
    # PATCH e DELETE para /careers/{id}/ (atualização e exclusão)
    path('<int:pk>/', views.post_detail, name='post_detail'),
] 