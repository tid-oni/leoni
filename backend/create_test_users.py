#!/usr/bin/env python
"""
Script pour créer les utilisateurs de test
Exécutez avec: python manage.py shell < create_test_users.py
"""

from agents.models import Agent
from machines.models import Machine

# Créer les agents de test
agents_data = [
    {
        'username': 'admin',
        'email': 'admin@leoni.com',
        'nom': 'Admin User',
        'role': 'admin',
        'is_superuser': True,
        'is_staff': True,
    },
    {
        'username': 'qualite1',
        'email': 'qualite1@leoni.com',
        'nom': 'Marie Curie',
        'role': 'qualité',
    },
    {
        'username': 'maintenance1',
        'email': 'maintenance1@leoni.com',
        'nom': 'Nikola Tesla',
        'role': 'maintenance',
    },
    {
        'username': 'qualite2',
        'email': 'qualite2@leoni.com',
        'nom': 'Louis Pasteur',
        'role': 'qualité',
    },
    {
        'username': 'maintenance2',
        'email': 'maintenance2@leoni.com',
        'nom': 'Isaac Newton',
        'role': 'maintenance',
    },
]

for agent_data in agents_data:
    if not Agent.objects.filter(username=agent_data['username']).exists():
        agent = Agent.objects.create_user(
            username=agent_data['username'],
            email=agent_data['email'],
            password='admin123' if agent_data['role'] == 'admin' else 'password123',
            nom=agent_data['nom'],
            role=agent_data['role'],
        )
        if agent_data.get('is_superuser'):
            agent.is_superuser = True
            agent.is_staff = True
            agent.save()
        print(f"Agent créé: {agent.nom} ({agent.role})")
    else:
        print(f"Agent existe déjà: {agent_data['username']}")

# Créer les machines de test
machines_data = [
    {
        'nom_machine': 'Presse Hydraulique A-100',
        'localisation': 'Atelier 1',
        'description': 'Presse hydraulique pour formage des pièces métalliques',
    },
    {
        'nom_machine': 'Robot de Soudure B-200',
        'localisation': 'Atelier 2',
        'description': 'Robot automatisé pour soudure des composants',
    },
    {
        'nom_machine': 'Tour CNC C-300',
        'localisation': 'Atelier 1',
        'description': 'Tour à commande numérique pour usinage de précision',
    },
    {
        'nom_machine': 'Ligne d\'assemblage D-400',
        'localisation': 'Atelier 3',
        'description': 'Ligne automatisée d\'assemblage des produits finis',
    },
]

for machine_data in machines_data:
    if not Machine.objects.filter(nom_machine=machine_data['nom_machine']).exists():
        machine = Machine.objects.create(**machine_data)
        print(f"Machine créée: {machine.nom_machine}")
    else:
        print(f"Machine existe déjà: {machine_data['nom_machine']}")

print("Initialisation terminée!")