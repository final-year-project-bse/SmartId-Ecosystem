from django.contrib import admin
from .models import FaceEnrollment, AuthenticationLog


@admin.register(FaceEnrollment)
class FaceEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'enrolled_at', 'updated_at']
    search_fields = ['user__username', 'user__email']


@admin.register(AuthenticationLog)
class AuthenticationLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'method', 'success', 'timestamp', 'ip_address']
    list_filter = ['method', 'success', 'timestamp']
    search_fields = ['user__username']
