from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from agents.models import Agent
from machines.models import Machine
from interventions.models import Intervention
from .serializers import FaceVerificationSerializer
from .face_utils import encode_face_from_base64, compare_faces
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_face_id(request):
    """
    Vérifie l'identité via Face ID et autorise l'accès à la machine
    """
    serializer = FaceVerificationSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    live_photo = data['live_photo']
    agent_id = data['agent_id']
    problem_type = data['problem_type']
    machine_id = data['machine_id']
    
    try:
        # Récupérer l'agent et la machine
        agent = Agent.objects.get(id=agent_id)
        machine = Machine.objects.get(id=machine_id)
        
        # Vérifier si l'agent a le bon rôle pour le type de problème
        role_problem_mapping = {
            'matière': 'qualité',
            'technique': 'maintenance',
            'câblage': 'maintenance'
        }
        
        required_role = role_problem_mapping.get(problem_type)
        if agent.role != required_role and agent.role != 'admin':
            return Response({
                'is_match': False,
                'is_authorized': False,
                'message': f"Accès refusé. Le rôle '{agent.role}' n'est pas autorisé pour un problème de type '{problem_type}'."
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Encoder le visage de la photo live
        live_encoding = encode_face_from_base64(live_photo)
        if not live_encoding:
            return Response({
                'is_match': False,
                'is_authorized': False,
                'message': "Aucun visage détecté dans la photo. Veuillez réessayer."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Récupérer l'encodage de référence de l'agent
        if not agent.face_encoding:
            return Response({
                'is_match': False,
                'is_authorized': False,
                'message': "Aucun encodage de référence trouvé pour cet agent."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reference_encoding = json.loads(agent.face_encoding)
        
        # Comparer les visages
        is_match = compare_faces(reference_encoding, live_encoding)
        
        if is_match:
            # Créer une nouvelle intervention
            intervention = Intervention.objects.create(
                machine=machine,
                agent=agent,
                type_probleme=problem_type,
                statut='résolu',
                date_deverrouillage=timezone.now(),
                description=f"Accès autorisé via Face ID pour problème {problem_type}"
            )
            
            return Response({
                'is_match': True,
                'is_authorized': True,
                'message': "Vérification réussie, accès autorisé.",
                'intervention_id': intervention.id
            })
        else:
            return Response({
                'is_match': False,
                'is_authorized': False,
                'message': "Le visage ne correspond pas à la référence."
            }, status=status.HTTP_403_FORBIDDEN)
            
    except Agent.DoesNotExist:
        return Response({
            'is_match': False,
            'is_authorized': False,
            'message': "Agent non trouvé."
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Machine.DoesNotExist:
        return Response({
            'is_match': False,
            'is_authorized': False,
            'message': "Machine non trouvée."
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'is_match': False,
            'is_authorized': False,
            'message': f"Erreur technique: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_face_encoding(request):
    """
    Upload et encode une photo de référence pour un agent
    """
    agent_id = request.data.get('agent_id')
    photo_base64 = request.data.get('photo')
    
    if not agent_id or not photo_base64:
        return Response({
            'error': 'agent_id et photo requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        agent = Agent.objects.get(id=agent_id)
        
        # Encoder le visage
        face_encoding = encode_face_from_base64(photo_base64)
        
        if face_encoding:
            agent.face_encoding = json.dumps(face_encoding)
            agent.save()
            
            return Response({
                'message': 'Encodage du visage sauvegardé avec succès'
            })
        else:
            return Response({
                'error': 'Aucun visage détecté dans la photo'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Agent.DoesNotExist:
        return Response({
            'error': 'Agent non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Erreur technique: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)