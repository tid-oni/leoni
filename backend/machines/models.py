from django.db import models

class Machine(models.Model):
    nom_machine = models.CharField(max_length=100)
    localisation = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.nom_machine} - {self.localisation}"
    
    class Meta:
        verbose_name = "Machine"
        verbose_name_plural = "Machines"