"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterventionTable } from './intervention-table';
import { useData } from '@/contexts/data-context';
import type { Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgentDashboardProps {
  user: Agent;
}

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const { interventions } = useData();
  const userInterventions = useMemo(
    () => interventions.filter(i => i.agent.id === user.id),
    [user.id, interventions]
  );

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.photoUrl} data-ai-hint="person portrait" />
                <AvatarFallback className="text-3xl">{user.nom.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.nom}</h1>
                <p className="text-muted-foreground">View your intervention history.</p>
            </div>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>My Interventions</CardTitle>
                <CardDescription>A log of all your machine interventions.</CardDescription>
            </CardHeader>
            <CardContent>
                <InterventionTable interventions={userInterventions} />
            </CardContent>
        </Card>
    </div>
  );
}
