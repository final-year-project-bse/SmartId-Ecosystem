from rest_framework import serializers
from .models import AttendanceSession, AttendanceRecord


class AttendanceSessionSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = AttendanceSession
        fields = '__all__'


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = '__all__'
