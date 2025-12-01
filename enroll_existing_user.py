"""
Script to manually enroll face for existing users
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartid.settings')
django.setup()

from accounts.models import User
from authentication.face_recognition_service import FaceRecognitionService
from authentication.models import FaceEnrollment

def list_users():
    """List all users without face enrollment"""
    users = User.objects.all()
    enrolled_user_ids = FaceEnrollment.objects.values_list('user_id', flat=True)
    
    print("\n" + "=" * 60)
    print("USERS WITHOUT FACE ENROLLMENT")
    print("=" * 60)
    
    unenrolled = []
    for user in users:
        if user.id not in enrolled_user_ids:
            unenrolled.append(user)
            print(f"\nID: {user.id}")
            print(f"Username: {user.username}")
            print(f"Email: {user.email}")
            print(f"Role: {user.role}")
            print("-" * 60)
    
    if not unenrolled:
        print("\n✓ All users have face enrollment!")
    
    return unenrolled

def enroll_user_face(user_id, image_path):
    """Enroll face for a specific user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        print(f"✗ User with ID {user_id} not found")
        return False
    
    if not os.path.exists(image_path):
        print(f"✗ Image file not found: {image_path}")
        return False
    
    print(f"\nEnrolling face for user: {user.username}")
    print(f"Image: {image_path}")
    
    face_service = FaceRecognitionService()
    result = face_service.enroll_face(user, image_path)
    
    if result['success']:
        print(f"✓ {result['message']}")
        return True
    else:
        print(f"✗ {result['message']}")
        return False

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("FACE ENROLLMENT TOOL")
    print("=" * 60)
    
    if len(sys.argv) > 1:
        # Enroll specific user
        if len(sys.argv) < 3:
            print("\nUsage: python enroll_existing_user.py <user_id> <image_path>")
            print("Example: python enroll_existing_user.py 1 face.jpg")
            sys.exit(1)
        
        user_id = sys.argv[1]
        image_path = sys.argv[2]
        enroll_user_face(user_id, image_path)
    else:
        # List unenrolled users
        list_users()
        print("\nTo enroll a user, run:")
        print("python enroll_existing_user.py <user_id> <image_path>")
        print("\nExample:")
        print("python enroll_existing_user.py 1 my_photo.jpg")
    
    print("\n" + "=" * 60)
