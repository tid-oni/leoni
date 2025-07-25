'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import { AddEditAgentDialog } from './add-edit-agent-dialog';
import type { Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AgentTableProps {
  agents: Agent[];
  onAdd: (newAgent: Omit<Agent, 'id' | 'face_encoding'>) => void;
  onUpdate: (updatedAgent: Agent) => void;
  onDelete: (agentId: string) => void;
}

export function AgentTable({ agents, onAdd, onUpdate, onDelete }: AgentTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleAddClick = () => {
    setSelectedAgent(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      onDelete(agentId);
    }
  };

  const handleSave = (agentData: Agent) => {
    if (selectedAgent) {
      onUpdate(agentData);
    } else {
      // The context will handle adding the ID and face encoding
      const { id, face_encoding, ...newAgent } = agentData;
      onAdd(newAgent);
    }
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={agent.photoUrl} data-ai-hint="person portrait" />
                      <AvatarFallback>{agent.nom.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {agent.nom}
                  </div>
                </TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>
                  <Badge variant={agent.rôle === 'qualité' ? 'default' : 'secondary'}>
                    {agent.rôle}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(agent)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(agent.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddEditAgentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        agent={selectedAgent}
      />
    </div>
  );
}
