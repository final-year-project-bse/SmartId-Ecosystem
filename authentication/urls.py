from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FaceEnrollmentViewSet, AuthenticationLogViewSet

router = DefaultRouter()
router.register(r'faces', FaceEnrollmentViewSet, basename='face')
router.register(r'logs', AuthenticationLogViewSet, basename='log')

urlpatterns = [
    path('', include(router.urls)),
]
