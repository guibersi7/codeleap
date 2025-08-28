from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'username', 'created_datetime', 'title', 'content']
        read_only_fields = ['id', 'username', 'created_datetime']

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content']
    
    def create(self, validated_data):
        # O usuário será definido automaticamente nas views
        validated_data['user'] = self.context['request'].user
        validated_data['username'] = self.context['request'].user.username
        return super().create(validated_data)

class UpdatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content'] 