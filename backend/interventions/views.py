from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Intervention
from .serializers import InterventionSerializer, InterventionCreateSerializer

class InterventionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Intervention.objects.all()
        # Filtrer par agent si ce n'est pas un admin
        if self.request.user.role != 'admin':
            queryset = queryset.filter(agent=self.request.user)
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InterventionCreateSerializer
        return InterventionSerializer

class InterventionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_intervention(request, pk):
    try:
        intervention = Intervention.objects.get(pk=pk)
        intervention.statut = 'résolu'
        intervention.date_deverrouillage = timezone.now()
        intervention.save()
        
        serializer = InterventionSerializer(intervention)
        return Response(serializer.data)
    except Intervention.DoesNotExist:
        return Response({'error': 'Intervention non trouvée'}, status=status.HTTP_404_NOT_FOUND)