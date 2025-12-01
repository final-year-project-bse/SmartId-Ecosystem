from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, ProfessorProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'profile_image', 'has_access',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users"""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'role', 'phone', 'profile_image'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            print(f"Error creating user: {e}")
            print(f"Validated data: {validated_data}")
            raise


class StudentProfileSerializer(serializers.ModelSerializer):
    """Serializer for Student Profile"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'


class ProfessorProfileSerializer(serializers.ModelSerializer):
    """Serializer for Professor Profile"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProfessorProfile
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)
