from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, ProfessorProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'has_access', 'created_at']
    list_filter = ['role', 'has_access', 'is_staff']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('SmartID Info', {'fields': ('role', 'phone', 'profile_image', 'face_encoding', 'has_access')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('SmartID Info', {'fields': ('role', 'phone', 'has_access')}),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['student_id', 'user', 'department', 'semester', 'enrollment_date']
    search_fields = ['student_id', 'user__username', 'user__email']
    list_filter = ['department', 'semester']


@admin.register(ProfessorProfile)
class ProfessorProfileAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'department', 'designation', 'joining_date']
    search_fields = ['employee_id', 'user__username', 'user__email']
    list_filter = ['department', 'designation']
