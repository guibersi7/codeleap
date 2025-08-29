from django.db import models
from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        null=True,
        blank=True,
        help_text="Usuário que criou o post"
    )
    username = models.CharField(
        max_length=100,
        help_text="Username para exibição (mantido para compatibilidade)"
    )
    created_datetime = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        help_text="URL da imagem do post (Cloudinary)"
    )

    class Meta:
        ordering = ['-created_datetime']  # Mais recente primeiro
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        indexes = [
            models.Index(fields=['-created_datetime']),
            models.Index(fields=['user']),
            models.Index(fields=['username']),
        ]

    def __str__(self):
        return f"{self.title} by {self.username}"
    
    def save(self, *args, **kwargs):
        # Garantir que o username seja sempre o mesmo do usuário
        if self.user:
            self.username = self.user.username
        else:
            # Se não há usuário, usar um username padrão
            if not self.username:
                self.username = "Anonymous"
        super().save(*args, **kwargs)

    @property
    def likes_count(self):
        return self.likes.count()
    
    @property
    def comments_count(self):
        return self.comments.count()

class Like(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes',
        help_text="Post que recebeu o like"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_likes',
        help_text="Usuário que deu o like"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'user']  # Um usuário só pode dar like uma vez por post
        verbose_name = "Like"
        verbose_name_plural = "Likes"
        indexes = [
            models.Index(fields=['post', 'user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Like de {self.user.username} em {self.post.title}"

class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Post que recebeu o comentário"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_comments',
        help_text="Usuário que fez o comentário"
    )
    content = models.TextField(max_length=1000, help_text="Conteúdo do comentário")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']  # Comentários mais antigos primeiro
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        indexes = [
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"Comentário de {self.user.username} em {self.post.title}"

class Mention(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='mentions',
        help_text="Post que contém a menção"
    )
    mentioned_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mentions_received',
        help_text="Usuário que foi mencionado"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'mentioned_user']  # Evitar menções duplicadas
        verbose_name = "Mention"
        verbose_name_plural = "Mentions"
        indexes = [
            models.Index(fields=['post', 'mentioned_user']),
            models.Index(fields=['mentioned_user', 'created_at']),
        ]

    def __str__(self):
        return f"Menção de {self.mentioned_user.username} em {self.post.title}"
