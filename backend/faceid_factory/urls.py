"""
URL configuration for faceid_factory project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('agents.urls')),
    path('api/machines/', include('machines.urls')),
    path('api/interventions/', include('interventions.urls')),
    path('api/face-recognition/', include('face_recognition_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)