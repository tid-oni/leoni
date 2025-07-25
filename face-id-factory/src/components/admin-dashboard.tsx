"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentTable } from './agent-table';
import { InterventionTable } from './intervention-table';
import { useData } from '@/contexts/data-context';
import { User, Wrench } from 'lucide-react';

export default function AdminDashboard() {
  const { agents, interventions, addAgent, updateAgent, deleteAgent } = useData();
  
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage agents and monitor all interventions.</p>
            </div>
        </div>
        <Tabs defaultValue="interventions" className="space-y-4">
            <TabsList>
            <TabsTrigger value="interventions"><Wrench className="mr-2 h-4 w-4" />Interventions</TabsTrigger>
            <TabsTrigger value="agents"><User className="mr-2 h-4 w-4" />Agent Management</TabsTrigger>
            </TabsList>
            <TabsContent value="interventions">
                <Card>
                    <CardHeader>
                        <CardTitle>All Interventions</CardTitle>
                        <CardDescription>View and filter all interventions across the factory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InterventionTable interventions={interventions} allAgents={agents} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="agents">
                <Card>
                    <CardHeader>
                        <CardTitle>Agent Management</CardTitle>
                        <CardDescription>Add, edit, or remove agents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AgentTable 
                            agents={agents.filter(a => a.rôle !== 'admin')} 
                            onAdd={addAgent} 
                            onUpdate={updateAgent} 
                            onDelete={deleteAgent} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
