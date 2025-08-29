# Generated manually to fix usernames

from django.db import migrations

def fix_usernames(apps, schema_editor):
    Post = apps.get_model('posts', 'Post')
    
    # Corrigir usernames para posts que têm usuário associado
    for post in Post.objects.filter(user__isnull=False):
        if post.user and post.username != post.user.username:
            print(f"Fixing username for post {post.id}: {post.username} -> {post.user.username}")
            post.username = post.user.username
            post.save()

def reverse_fix_usernames(apps, schema_editor):
    # Não há necessidade de reverter esta migração
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_alter_post_options_post_user_alter_post_username'),
    ]

    operations = [
        migrations.RunPython(fix_usernames, reverse_fix_usernames),
    ]
