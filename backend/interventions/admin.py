from django.contrib import admin
from .models import Intervention

@admin.register(Intervention)
class InterventionAdmin(admin.ModelAdmin):
    list_display = ['machine', 'agent', 'type_probleme', 'statut', 'date_blocage', 'date_deverrouillage']
    list_filter = ['type_probleme', 'statut', 'date_blocage']
    search_fields = ['machine__nom_machine', 'agent__nom']
    list_editable = ['statut']
    date_hierarchy = 'date_blocage'