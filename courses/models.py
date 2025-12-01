from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Course(models.Model):
    """Course model"""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_teaching',
        limit_choices_to={'role': 'PROFESSOR'}
    )
    schedule = models.CharField(max_length=100, help_text=_('e.g., Mon/Wed 10:00-11:30'))
    room = models.CharField(max_length=50, blank=True)
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Course')
        verbose_name_plural = _('Courses')
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Enrollment(models.Model):
    """Student enrollment in courses"""
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
        limit_choices_to={'role': 'STUDENT'}
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-enrolled_date']
        verbose_name = _('Enrollment')
        verbose_name_plural = _('Enrollments')
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.code}"
