"""
Test script to verify face recognition setup
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartid.settings')
django.setup()

from authentication.models import FaceEnrollment
from accounts.models import User

print("=" * 50)
print("Face Recognition System Test")
print("=" * 50)

# Check if face_recognition is available
try:
    import face_recognition
    import cv2
    print("✓ face_recognition library: INSTALLED")
    print("✓ opencv-python library: INSTALLED")
    FACE_RECOGNITION_AVAILABLE = True
except ImportError as e:
    print(f"✗ Libraries missing: {e}")
    FACE_RECOGNITION_AVAILABLE = False

print("\n" + "=" * 50)
print("Database Status")
print("=" * 50)

# Check users
users = User.objects.all()
print(f"Total users in database: {users.count()}")
for user in users:
    print(f"  - {user.username} ({user.email}) - Role: {user.role}")

# Check enrollments
enrollments = FaceEnrollment.objects.all()
print(f"\nTotal face enrollments: {enrollments.count()}")
for enrollment in enrollments:
    print(f"  - User: {enrollment.user.username}")
    print(f"    Has encoding: {enrollment.face_encoding is not None}")
    print(f"    Image: {enrollment.face_image}")

print("\n" + "=" * 50)
print("System Status")
print("=" * 50)

if FACE_RECOGNITION_AVAILABLE:
    print("✓ Face recognition is READY")
    print("✓ You can now enroll users and authenticate")
else:
    print("✗ Face recognition libraries not available")
    print("  System running in DEMO MODE")

if enrollments.count() == 0:
    print("\n⚠ No users enrolled yet!")
    print("  Please enroll at least one user to test authentication")
else:
    print(f"\n✓ {enrollments.count()} user(s) enrolled and ready for authentication")

print("=" * 50)
