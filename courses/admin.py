from django.contrib import admin
from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'professor', 'semester', 'is_active']
    list_filter = ['is_active', 'semester']
    search_fields = ['code', 'name', 'professor__username']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'enrolled_date', 'is_active']
    list_filter = ['is_active', 'enrolled_date']
    search_fields = ['student__username', 'course__code']
