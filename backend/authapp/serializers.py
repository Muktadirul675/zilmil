from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from django.core.cache import cache

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']

class UserWithGroupsSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)
    total_confirmed_orders = serializers.SerializerMethodField()
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups', 'total_confirmed_orders','is_locked']

    def get_total_confirmed_orders(self, obj):
        return obj.confirm_orders.count()

    def get_is_locked(self, obj):
        key = f"user:{obj.id}:lock"
        locked = cache.get(key)
        if locked:
            return True
        return False
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data