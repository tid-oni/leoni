from django.contrib import admin
from .models import Machine

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ['nom_machine', 'localisation', 'is_active', 'created_at']
    list_filter = ['is_active', 'localisation', 'created_at']
    search_fields = ['nom_machine', 'localisation']
    list_editable = ['is_active']