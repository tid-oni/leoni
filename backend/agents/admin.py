from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Agent

@admin.register(Agent)
class AgentAdmin(UserAdmin):
    list_display = ['username', 'nom', 'email', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['username', 'nom', 'email']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('nom', 'role', 'photo', 'face_encoding')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('nom', 'role', 'photo')
        }),
    )