'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import type { Intervention, Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface InterventionTableProps {
  interventions: Intervention[];
  allAgents?: Agent[]; // Only for admin view
}

export function InterventionTable({ interventions, allAgents }: InterventionTableProps) {
  const [agentFilter, setAgentFilter] = useState('all');
  const [problemFilter, setProblemFilter] = useState('all');
  const [machineFilter, setMachineFilter] = useState('');

  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const agentMatch = agentFilter === 'all' || i.agent.id === agentFilter;
      const problemMatch = problemFilter === 'all' || i.type_probleme === problemFilter;
      const machineMatch = i.machine.nom_machine.toLowerCase().includes(machineFilter.toLowerCase());
      return agentMatch && problemMatch && machineMatch;
    });
  }, [interventions, agentFilter, problemFilter, machineFilter]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-muted-foreground">N/A</span>;
    return format(new Date(dateString), "dd/MM/yyyy 'at' HH:mm");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {allAgents && (
            <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger><SelectValue placeholder="Filter by agent..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {allAgents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.nom}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )}
            <Select value={problemFilter} onValueChange={setProblemFilter}>
                <SelectTrigger><SelectValue placeholder="Filter by problem type..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Problem Types</SelectItem>
                        <SelectItem value="technique">Technique</SelectItem>
                        <SelectItem value="matière">Matière</SelectItem>
                    </SelectContent>
            </Select>
        <Input 
            placeholder="Filter by machine name..."
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className={!allAgents ? "md:col-span-2" : "md:col-span-1"}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine</TableHead>
              {allAgents && <TableHead>Agent</TableHead>}
              <TableHead>Problem Type</TableHead>
              <TableHead>Blocked At</TableHead>
              <TableHead>Unlocked At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterventions.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={allAgents ? 6 : 5} className="h-24 text-center">
                        No interventions found.
                    </TableCell>
                </TableRow>
            ) : (
                filteredInterventions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.machine.nom_machine}</TableCell>
                    {allAgents && 
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={item.agent.photoUrl} />
                                    <AvatarFallback>{item.agent.nom.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {item.agent.nom}
                            </div>
                        </TableCell>
                    }
                    <TableCell>
                      <Badge variant={
                        item.type_probleme === 'technique' ? 'destructive' :
                        'secondary'
                      }>
                        {item.type_probleme}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(item.date_blocage)}</TableCell>
                    <TableCell>{formatDate(item.date_deverrouillage)}</TableCell>
                    <TableCell>
                      <Badge variant={item.statut === 'résolu' ? 'default' : 'outline'} className={item.statut === 'résolu' ? 'bg-green-600' : ''}>
                        {item.statut}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
