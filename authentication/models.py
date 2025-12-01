from django.db import models
from django.conf import settings


class FaceEnrollment(models.Model):
    """Store facial recognition enrollment data"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    face_image = models.ImageField(upload_to='faces/')
    face_encoding = models.BinaryField()
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Face enrollment for {self.user.username}"


class AuthenticationLog(models.Model):
    """Log all authentication attempts"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    method = models.CharField(max_length=20)  # face, rfid, qr, fingerprint
    success = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.method} - {self.user} - {'Success' if self.success else 'Failed'}"
