"""
URL configuration for SmartID project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.generic import TemplateView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def api_root(request):
    """Root API endpoint"""
    return JsonResponse({
        'message': 'Welcome to SmartID Attendance System API',
        'version': '1.0',
        'endpoints': {
            'django_admin': '/django-admin/',
            'api_docs': '/api/docs/',
            'redoc': '/api/redoc/',
            'authentication': '/api/auth/',
            'attendance': '/api/attendance/',
            'courses': '/api/courses/',
            'face_recognition': '/api/authentication/',
        }
    })

class ReactAppView(TemplateView):
    """Serve React frontend"""
    template_name = 'index.html'

# API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="SmartID Attendance API",
        default_version='v1',
        description="API documentation for SmartID Facial Recognition Attendance System",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@smartid.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Django Admin Panel (moved to avoid conflict with React routes)
    path('django-admin/', admin.site.urls),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/info/', api_root, name='api-root'),
    
    # API Endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/authentication/', include('authentication.urls')),
]

# Serve media and static files in development
if settings.DEBUG:
    from django.views.static import serve as static_serve
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Serve React assets
    urlpatterns += [
        path('assets/<path:path>', static_serve, {
            'document_root': settings.BASE_DIR.parent / 'smartid-frontend' / 'dist' / 'assets',
        }),
        path('vite.svg', static_serve, {
            'document_root': settings.BASE_DIR.parent / 'smartid-frontend' / 'dist',
            'path': 'vite.svg',
        }),
    ]

# Serve React App - This must be last to catch all other routes
urlpatterns += [
    re_path(r'^.*$', ReactAppView.as_view(), name='react-app'),
]
