from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'username', 'user', 'created_datetime', 'id')
    list_filter = ('created_datetime', 'username', 'user')
    search_fields = ('title', 'content', 'username', 'user__username')
    readonly_fields = ('id', 'created_datetime')
    ordering = ('-created_datetime',)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'username', 'title', 'content')
        }),
        ('Informações do Sistema', {
            'fields': ('id', 'created_datetime'),
            'classes': ('collapse',)
        }),
    )
