from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Agent

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'username', 'email', 'nom', 'role', 'photo', 'created_at']
        read_only_fields = ['id', 'created_at']

class AgentCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Agent
        fields = ['username', 'email', 'nom', 'role', 'photo', 'password']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        agent = Agent.objects.create_user(**validated_data)
        agent.set_password(password)
        agent.save()
        return agent

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            try:
                agent = Agent.objects.get(email=email)
                user = authenticate(username=agent.username, password=password)
                if user:
                    if user.is_active:
                        data['user'] = user
                        return data
                    else:
                        raise serializers.ValidationError('Compte désactivé.')
                else:
                    raise serializers.ValidationError('Identifiants invalides.')
            except Agent.DoesNotExist:
                raise serializers.ValidationError('Identifiants invalides.')
        else:
            raise serializers.ValidationError('Email et mot de passe requis.')