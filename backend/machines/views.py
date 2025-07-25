from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Machine
from .serializers import MachineSerializer

class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.filter(is_active=True)
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]