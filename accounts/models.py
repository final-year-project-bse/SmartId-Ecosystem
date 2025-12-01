from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model for SmartID system.
    Supports three roles: Admin, Professor, and Student.
    """
    
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Administrator')
        PROFESSOR = 'PROFESSOR', _('Professor')
        STUDENT = 'STUDENT', _('Student')
    
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
        help_text=_('User role in the system')
    )
    
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text=_('Contact phone number')
    )
    
    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        help_text=_('Profile picture')
    )
    
    face_encoding = models.BinaryField(
        blank=True,
        null=True,
        help_text=_('Facial recognition encoding data')
    )
    
    has_access = models.BooleanField(
        default=True,
        help_text=_('Whether user can access the system')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('User')
        verbose_name_plural = _('Users')
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
    
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN
    
    @property
    def is_professor(self):
        return self.role == self.Role.PROFESSOR
    
    @property
    def is_student(self):
        return self.role == self.Role.STUDENT


class StudentProfile(models.Model):
    """Extended profile for students"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    student_id = models.CharField(max_length=20, unique=True)
    enrollment_date = models.DateField()
    department = models.CharField(max_length=100)
    semester = models.IntegerField(default=1)
    
    class Meta:
        verbose_name = _('Student Profile')
        verbose_name_plural = _('Student Profiles')
    
    def __str__(self):
        return f"{self.student_id} - {self.user.get_full_name()}"


class ProfessorProfile(models.Model):
    """Extended profile for professors"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='professor_profile'
    )
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    joining_date = models.DateField()
    
    class Meta:
        verbose_name = _('Professor Profile')
        verbose_name_plural = _('Professor Profiles')
    
    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"
