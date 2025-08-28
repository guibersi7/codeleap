from django.db import models
from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        help_text="Usuário que criou o post"
    )
    username = models.CharField(
        max_length=100,
        help_text="Username para exibição (mantido para compatibilidade)"
    )
    created_datetime = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200)
    content = models.TextField()

    class Meta:
        ordering = ['-created_datetime']  # Mais recente primeiro
        verbose_name = "Post"
        verbose_name_plural = "Posts"

    def __str__(self):
        return f"{self.title} by {self.username}"
    
    def save(self, *args, **kwargs):
        # Garantir que o username seja sempre o mesmo do usuário
        if not self.username and self.user:
            self.username = self.user.username
        super().save(*args, **kwargs)
