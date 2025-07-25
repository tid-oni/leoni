export type AgentRole = 'qualité' | 'maintenance' | 'admin';

export interface Agent {
  id: string;
  nom: string;
  email: string;
  mot_de_passe: string; // In a real app, this would be a hash
  rôle: AgentRole;
  face_encoding: string; // Simulated
  photoUrl: string;
}

export interface Machine {
  id: string;
  nom_machine: string;
  localisation: string;
}

export type ProblemType = 'matière' | 'technique' | 'câblage';

export interface Intervention {
  id: string;
  machine: Machine;
  agent: Agent;
  type_probleme: ProblemType;
  date_blocage: string;
  date_deverrouillage: string | null;
  statut: 'en_cours' | 'résolu';
}
