from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('profile/', views.profile_view, name='profile'),
    path('agents/', views.AgentListCreateView.as_view(), name='agent-list-create'),
    path('agents/<int:pk>/', views.AgentDetailView.as_view(), name='agent-detail'),
]