from django.urls import path
from . import views

urlpatterns = [
    path('', views.InterventionListCreateView.as_view(), name='intervention-list-create'),
    path('<int:pk>/', views.InterventionDetailView.as_view(), name='intervention-detail'),
    path('<int:pk>/resolve/', views.resolve_intervention, name='resolve-intervention'),
]