from rest_framework import serializers
from .models import Intervention
from agents.serializers import AgentSerializer
from machines.serializers import MachineSerializer

class InterventionSerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)
    machine = MachineSerializer(read_only=True)
    agent_id = serializers.IntegerField(write_only=True)
    machine_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Intervention
        fields = [
            'id', 'machine', 'agent', 'machine_id', 'agent_id',
            'type_probleme', 'statut', 'date_blocage', 'date_deverrouillage',
            'description'
        ]
        read_only_fields = ['id', 'date_blocage']

class InterventionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervention
        fields = ['machine_id', 'agent_id', 'type_probleme', 'description']