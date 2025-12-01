from rest_framework import serializers
from .models import FaceEnrollment, AuthenticationLog


class FaceEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceEnrollment
        fields = '__all__'


class AuthenticationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthenticationLog
        fields = '__all__'
