from django.urls import path
from . import views

urlpatterns = [
    path('', views.MachineListCreateView.as_view(), name='machine-list-create'),
    path('<int:pk>/', views.MachineDetailView.as_view(), name='machine-detail'),
]