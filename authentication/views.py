from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import FaceEnrollment, AuthenticationLog
from .serializers import FaceEnrollmentSerializer, AuthenticationLogSerializer
from accounts.models import User
import os

# Try to import face recognition service
try:
    from .face_recognition_service import FaceRecognitionService, FACE_RECOGNITION_AVAILABLE
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False
    FaceRecognitionService = None


class FaceEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = FaceEnrollment.objects.all()
    serializer_class = FaceEnrollmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        """
        Allow enroll and verify endpoints without authentication
        """
        if self.action in ['enroll', 'verify', 'verify_camera']:
            return []
        return super().get_permissions()
    
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        """
        Enroll a new face for a user
        
        Expected data:
        - user_id: ID of the user
        - image: Face image file
        """
        if not FACE_RECOGNITION_AVAILABLE:
            # DEMO MODE: Save enrollment without face encoding
            user_id = request.data.get('user_id')
            image = request.FILES.get('image')
            
            if not user_id or not image:
                return Response(
                    {'error': 'user_id and image are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Save image
            image_path = default_storage.save(f'faces/{user.id}_{image.name}', ContentFile(image.read()))
            
            # Create enrollment record without face encoding
            enrollment, created = FaceEnrollment.objects.update_or_create(
                user=user,
                defaults={
                    'face_image': image_path,
                    'face_encoding': None  # No encoding in demo mode
                }
            )
            
            # Log enrollment
            AuthenticationLog.objects.create(
                user=user,
                method='face',
                success=True,
                ip_address=self.get_client_ip(request)
            )
            
            return Response({
                'success': True,
                'message': 'DEMO MODE: Face enrolled (face_recognition library not installed)',
                'user_id': user.id,
                'user_name': user.get_full_name() or user.username,
                'demo_mode': True
            }, status=status.HTTP_201_CREATED)
        
        user_id = request.data.get('user_id')
        image = request.FILES.get('image')
        
        if not user_id or not image:
            return Response(
                {'error': 'user_id and image are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Save image temporarily
        image_path = default_storage.save(f'temp/{image.name}', ContentFile(image.read()))
        full_path = default_storage.path(image_path)
        
        try:
            # Enroll face
            face_service = FaceRecognitionService()
            result = face_service.enroll_face(user, full_path)
            
            if result['success']:
                # Log enrollment
                AuthenticationLog.objects.create(
                    user=user,
                    method='face',
                    success=True,
                    ip_address=self.get_client_ip(request)
                )
                
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
                
        finally:
            # Clean up temp file
            if os.path.exists(full_path):
                os.remove(full_path)
    
    @action(detail=False, methods=['post'])
    def verify(self, request):
        """
        Verify a face against enrolled faces
        
        Expected data:
        - image: Face image file
        """
        if not FACE_RECOGNITION_AVAILABLE:
            # DEMO MODE: Return mock successful authentication for testing
            # This allows testing the UI flow without face_recognition library
            enrolled_users = FaceEnrollment.objects.select_related('user').all()
            
            if enrolled_users.exists():
                # Return first enrolled user as a demo
                demo_user = enrolled_users.first().user
                
                # Log demo authentication
                AuthenticationLog.objects.create(
                    user=demo_user,
                    method='face',
                    success=True,
                    ip_address=self.get_client_ip(request)
                )
                
                return Response({
                    'success': True,
                    'message': 'DEMO MODE: Face recognized (face_recognition library not installed)',
                    'results': [{
                        'user_id': demo_user.id,
                        'user_name': demo_user.get_full_name() or demo_user.username,
                        'confidence': 0.95,  # Mock confidence
                        'demo_mode': True
                    }]
                })
            else:
                return Response({
                    'success': False,
                    'message': 'No enrolled faces found. Please enroll users first.',
                    'demo_mode': True
                })
        
        image = request.FILES.get('image')
        
        if not image:
            return Response(
                {'error': 'image is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save image temporarily
        image_path = default_storage.save(f'temp/{image.name}', ContentFile(image.read()))
        full_path = default_storage.path(image_path)
        
        try:
            # Recognize face
            face_service = FaceRecognitionService()
            result = face_service.recognize_face(full_path)
            
            # Log authentication attempt
            if result['success'] and result.get('results'):
                user_id = result['results'][0]['user_id']
                user = User.objects.get(id=user_id)
                
                AuthenticationLog.objects.create(
                    user=user,
                    method='face',
                    success=True,
                    ip_address=self.get_client_ip(request)
                )
            else:
                AuthenticationLog.objects.create(
                    method='face',
                    success=False,
                    ip_address=self.get_client_ip(request)
                )
            
            return Response(result)
            
        finally:
            # Clean up temp file
            if os.path.exists(full_path):
                os.remove(full_path)
    
    @action(detail=False, methods=['post'])
    def verify_camera(self, request):
        """
        Verify face using webcam
        
        Expected data:
        - duration: Duration in seconds (optional, default 5)
        """
        duration = int(request.data.get('duration', 5))
        
        face_service = FaceRecognitionService()
        result = face_service.recognize_face_from_camera(duration)
        
        # Log authentication attempt
        if result['success']:
            user = User.objects.get(id=result['user_id'])
            AuthenticationLog.objects.create(
                user=user,
                method='face',
                success=True,
                ip_address=self.get_client_ip(request)
            )
        else:
            AuthenticationLog.objects.create(
                method='face',
                success=False,
                ip_address=self.get_client_ip(request)
            )
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get facial recognition statistics"""
        face_service = FaceRecognitionService()
        enrolled_count = face_service.load_known_faces()
        
        total_logs = AuthenticationLog.objects.filter(method='face').count()
        successful_logs = AuthenticationLog.objects.filter(method='face', success=True).count()
        
        return Response({
            'enrolled_faces': enrolled_count,
            'total_attempts': total_logs,
            'successful_attempts': successful_logs,
            'success_rate': (successful_logs / total_logs * 100) if total_logs > 0 else 0
        })
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AuthenticationLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuthenticationLog.objects.all()
    serializer_class = AuthenticationLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter logs based on user role"""
        user = self.request.user
        if user.is_admin:
            return AuthenticationLog.objects.all()
        return AuthenticationLog.objects.filter(user=user)
