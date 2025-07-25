from django.db import models
from agents.models import Agent
from machines.models import Machine

class Intervention(models.Model):
    PROBLEM_TYPES = [
        ('matière', 'Problème Matière'),
        ('technique', 'Problème Technique'),
        ('câblage', 'Problème Câblage'),
    ]
    
    STATUS_CHOICES = [
        ('en_cours', 'En cours'),
        ('résolu', 'Résolu'),
    ]
    
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='interventions')
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='interventions')
    type_probleme = models.CharField(max_length=20, choices=PROBLEM_TYPES)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='en_cours')
    date_blocage = models.DateTimeField(auto_now_add=True)
    date_deverrouillage = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.machine.nom_machine} - {self.type_probleme} - {self.statut}"
    
    class Meta:
        verbose_name = "Intervention"
        verbose_name_plural = "Interventions"
        ordering = ['-date_blocage']