import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const InterventionTable = ({ interventions, allAgents }) => {
  const [agentFilter, setAgentFilter] = useState('all');
  const [problemFilter, setProblemFilter] = useState('all');
  const [machineFilter, setMachineFilter] = useState('');

  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const agentMatch = agentFilter === 'all' || i.agent.id.toString() === agentFilter;
      const problemMatch = problemFilter === 'all' || i.type_probleme === problemFilter;
      const machineMatch = i.machine.nom_machine.toLowerCase().includes(machineFilter.toLowerCase());
      return agentMatch && problemMatch && machineMatch;
    });
  }, [interventions, agentFilter, problemFilter, machineFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-muted-foreground">N/A</span>;
    return format(new Date(dateString), "dd/MM/yyyy 'à' HH:mm", { locale: fr });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {allAgents && (
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par agent..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les Agents</SelectItem>
              {allAgents.map(agent => (
                <SelectItem key={agent.id} value={agent.id.toString()}>
                  {agent.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <Select value={problemFilter} onValueChange={setProblemFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par type de problème..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les Types</SelectItem>
            <SelectItem value="technique">Technique</SelectItem>
            <SelectItem value="matière">Matière</SelectItem>
            <SelectItem value="câblage">Câblage</SelectItem>
          </SelectContent>
        </Select>
        
        <Input 
          placeholder="Filtrer par nom de machine..."
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
              }
              <TableHead>Type de Problème</TableHead>
              <TableHead>Bloqué le</TableHead>
              <TableHead>Déverrouillé le</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterventions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={allAgents ? 6 : 5} className="h-24 text-center">
                  Aucune intervention trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredInterventions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.machine.nom_machine}</TableCell>
                  {allAgents && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {item.agent.nom.charAt(0)}
                        </div>
                        {item.agent.nom}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant={
                      item.type_probleme === 'technique' ? 'destructive' :
                      item.type_probleme === 'matière' ? 'secondary' : 'default'
                    }>
                      {item.type_probleme}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.date_blocage)}</TableCell>
                  <TableCell>{formatDate(item.date_deverrouillage)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.statut === 'résolu' ? 'default' : 'outline'} 
                      className={item.statut === 'résolu' ? 'bg-green-600' : ''}
                    >
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
};