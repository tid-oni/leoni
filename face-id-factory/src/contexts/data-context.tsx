'use client';

import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { Agent, Intervention } from '@/lib/types';
import { agents as initialAgents, interventions as initialInterventions } from '@/lib/data';

interface DataContextType {
  agents: Agent[];
  interventions: Intervention[];
  addAgent: (newAgent: Omit<Agent, 'id' | 'face_encoding'>) => void;
  updateAgent: (updatedAgent: Agent) => void;
  deleteAgent: (agentId: string) => void;
  addIntervention: (newIntervention: Intervention) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to get initial state from sessionStorage or fallback to initial data
const getInitialState = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Failed to parse ${key} from sessionStorage`, error);
    sessionStorage.removeItem(key);
  }
  return fallback;
};


export function DataProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(() => getInitialState('agents', initialAgents));
  const [interventions, setInterventions] = useState<Intervention[]>(() => getInitialState('interventions', initialInterventions));

  // Persist agents to sessionStorage whenever they change
  useEffect(() => {
    try {
        sessionStorage.setItem('agents', JSON.stringify(agents));
    } catch (error) {
        console.error('Failed to save agents to sessionStorage', error);
    }
  }, [agents]);

  // Persist interventions to sessionStorage whenever they change
  useEffect(() => {
    try {
        sessionStorage.setItem('interventions', JSON.stringify(interventions));
    } catch (error) {
        console.error('Failed to save interventions to sessionStorage', error);
    }
  }, [interventions]);


  const addAgent = (newAgent: Omit<Agent, 'id' | 'face_encoding'>) => {
    setAgents(prev => [...prev, { ...newAgent, id: `agent-${Date.now()}`, face_encoding: `encoding_${Date.now()}` }]);
  };

  const updateAgent = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(a => (a.id === updatedAgent.id ? updatedAgent : a)));
  };

  const deleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
  };
  
  const addIntervention = (newIntervention: Intervention) => {
    setInterventions(prev => [newIntervention, ...prev]);
  };


  const value = {
    agents,
    interventions,
    addAgent,
    updateAgent,
    deleteAgent,
    addIntervention,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
