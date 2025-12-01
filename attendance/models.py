from django.db import models
from django.conf import settings
from courses.models import Course


class AttendanceSession(models.Model):
    """Attendance session for a course"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='sessions')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('completed', 'Completed')],
        default='active'
    )
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', '-start_time']
    
    def __str__(self):
        return f"{self.course.code} - {self.date}"


class AttendanceRecord(models.Model):
    """Individual attendance record"""
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('present', 'Present'), ('absent', 'Absent'), ('late', 'Late')],
        default='absent'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=20, default='face')  # face, rfid, qr, fingerprint
    
    class Meta:
        unique_together = ['session', 'student']
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.student.username} - {self.session.course.code} - {self.status}"
