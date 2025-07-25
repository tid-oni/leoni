from django.contrib.auth.models import AbstractUser
from django.db import models

class Agent(AbstractUser):
    ROLE_CHOICES = [
        ('qualité', 'Qualité'),
        ('maintenance', 'Maintenance'),
        ('admin', 'Administrateur'),
    ]
    
    nom = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='qualité')
    photo = models.ImageField(upload_to='agent_photos/', null=True, blank=True)
    face_encoding = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.nom} ({self.role})"
    
    class Meta:
        verbose_name = "Agent"
        verbose_name_plural = "Agents"