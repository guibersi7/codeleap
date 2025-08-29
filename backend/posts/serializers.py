from rest_framework import serializers
from .models import Post, Like, Comment, Mention

class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'username', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'username', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'username', 'created_at', 'updated_at']

class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['post_id'] = self.context['post_id']
        return super().create(validated_data)

class MentionSerializer(serializers.ModelSerializer):
    mentioned_username = serializers.CharField(source='mentioned_user.username', read_only=True)
    
    class Meta:
        model = Mention
        fields = ['id', 'mentioned_username', 'created_at']
        read_only_fields = ['id', 'mentioned_username', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    user_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'username', 'created_datetime', 'title', 'content', 'image', 'likes_count', 'comments_count', 'user_liked']
        read_only_fields = ['id', 'username', 'created_datetime', 'likes_count', 'comments_count', 'user_liked']
    
    def get_user_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content', 'image']
    
    def create(self, validated_data):
        # O usuário será definido automaticamente nas views
        validated_data['user'] = self.context['request'].user
        validated_data['username'] = self.context['request'].user.username
        return super().create(validated_data)

class UpdatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content', 'image'] 