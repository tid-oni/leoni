import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Wrench, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AgentTable } from '../components/AgentTable';
import { InterventionTable } from '../components/InterventionTable';
import { agentService, interventionService } from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agentsResponse, interventionsResponse] = await Promise.all([
        agentService.getAgents(),
        interventionService.getInterventions(),
      ]);
      
      setAgents(agentsResponse.data);
      setInterventions(interventionsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentCreate = async (agentData) => {
    try {
      await agentService.createAgent(agentData);
      loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la création de l\'agent:', error);
    }
  };

  const handleAgentUpdate = async (id, agentData) => {
    try {
      await agentService.updateAgent(id, agentData);
      loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'agent:', error);
    }
  };

  const handleAgentDelete = async (id) => {
    try {
      await agentService.deleteAgent(id);
      loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'agent:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const userInterventions = isAdmin ? interventions : interventions.filter(i => i.agent.id === user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? 'Dashboard Administrateur' : `Bienvenue, ${user?.nom}`}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Gérez les agents et surveillez toutes les interventions.' 
              : 'Consultez l\'historique de vos interventions.'
            }
          </p>
        </div>
      </div>

      <Tabs defaultValue="interventions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interventions">
            <Wrench className="mr-2 h-4 w-4" />
            Interventions
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="agents">
              <User className="mr-2 h-4 w-4" />
              Gestion des Agents
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="interventions">
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin ? 'Toutes les Interventions' : 'Mes Interventions'}
              </CardTitle>
              <CardDescription>
                {isAdmin 
                  ? 'Visualisez et filtrez toutes les interventions de l\'usine.'
                  : 'Un journal de toutes vos interventions sur les machines.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InterventionTable 
                interventions={userInterventions} 
                allAgents={isAdmin ? agents : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Agents</CardTitle>
                <CardDescription>
                  Ajoutez, modifiez ou supprimez des agents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentTable 
                  agents={agents.filter(a => a.role !== 'admin')}
                  onAdd={handleAgentCreate}
                  onUpdate={handleAgentUpdate}
                  onDelete={handleAgentDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};