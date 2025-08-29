# Generated manually to ensure correct usernames

from django.db import migrations

def ensure_correct_usernames(apps, schema_editor):
    Post = apps.get_model('posts', 'Post')
    
    # Corrigir usernames para posts que têm usuário associado
    for post in Post.objects.filter(user__isnull=False):
        if post.user and post.username != post.user.username:
            print(f"Fixing username for post {post.id}: {post.username} -> {post.user.username}")
            post.username = post.user.username
            post.save()
    
    # Para posts sem usuário, definir como Anonymous se estiver vazio
    for post in Post.objects.filter(user__isnull=True):
        if not post.username or post.username.strip() == "":
            print(f"Setting anonymous username for post {post.id}")
            post.username = "Anonymous"
            post.save()

def reverse_ensure_correct_usernames(apps, schema_editor):
    # Não há necessidade de reverter esta migração
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_fix_usernames'),
    ]

    operations = [
        migrations.RunPython(ensure_correct_usernames, reverse_ensure_correct_usernames),
    ]
