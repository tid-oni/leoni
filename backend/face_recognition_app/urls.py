from django.urls import path
from . import views

urlpatterns = [
    path('verify/', views.verify_face_id, name='verify-face-id'),
    path('upload-encoding/', views.upload_face_encoding, name='upload-face-encoding'),
]