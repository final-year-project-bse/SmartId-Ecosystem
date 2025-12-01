from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .models import StudentProfile, ProfessorProfile
from .serializers import (
    UserSerializer, UserCreateSerializer,
    StudentProfileSerializer, ProfessorProfileSerializer,
    LoginSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User CRUD operations"""
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Allow user creation without authentication for enrollment"""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create to add logging"""
        print(f"Received user creation request: {request.data}")
        try:
            response = super().create(request, *args, **kwargs)
            print(f"✓ User created successfully")
            return response
        except Exception as e:
            print(f"❌ User creation failed: {e}")
            raise
    
    def get_queryset(self):
        """Filter users based on role"""
        user = self.request.user
        if user.is_admin:
            return User.objects.all()
        elif user.is_professor:
            return User.objects.filter(role=User.Role.STUDENT)
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """User login endpoint"""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        role = serializer.validated_data['role']
        
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if user is None:
            # Try with email
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check role
        if user.role != role:
            return Response(
                {'error': f'No {role.lower()} account found with this email'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check access
        if not user.has_access:
            return Response(
                {'error': 'Your account has been disabled'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def toggle_access(self, request, pk=None):
        """Enable/disable user access (Admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_object()
        user.has_access = not user.has_access
        user.save()
        
        return Response({
            'message': f'User access {"enabled" if user.has_access else "disabled"}',
            'has_access': user.has_access
        })


class StudentProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for Student Profile operations"""
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin or user.is_professor:
            return StudentProfile.objects.all()
        return StudentProfile.objects.filter(user=user)


class ProfessorProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for Professor Profile operations"""
    queryset = ProfessorProfile.objects.all()
    serializer_class = ProfessorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return ProfessorProfile.objects.all()
        return ProfessorProfile.objects.filter(user=user)
