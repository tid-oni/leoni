import type { Agent, Machine, Intervention } from './types';

export const agents: Agent[] = [
  {
    id: 'admin-01',
    nom: 'Admin User',
    email: 'admin@leoni.com',
    mot_de_passe: 'admin123',
    rôle: 'admin',
    face_encoding: 'encoding_admin_01',
    photoUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: 'qual-01',
    nom: 'Marie Curie',
    email: 'qualite1@leoni.com',
    mot_de_passe: 'password123',
    rôle: 'qualité',
    face_encoding: 'encoding_qual_01',
    photoUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: 'maint-01',
    nom: 'Nikola Tesla',
    email: 'maintenance1@leoni.com',
    mot_de_passe: 'password123',
    rôle: 'maintenance',
    face_encoding: 'encoding_maint_01',
    photoUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: 'qual-02',
    nom: 'Louis Pasteur',
    email: 'qualite2@leoni.com',
    mot_de_passe: 'password123',
    rôle: 'qualité',
    face_encoding: 'encoding_qual_02',
    photoUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: 'maint-02',
    nom: 'Isaac Newton',
    email: 'maintenance2@leoni.com',
    mot_de_passe: 'password123',
    rôle: 'maintenance',
    face_encoding: 'encoding_maint_02',
    photoUrl: 'https://placehold.co/128x128.png',
  }
];

export const machines: Machine[] = [
  { id: 'machine-01', nom_machine: 'Presse Hydraulique A-100', localisation: 'Atelier 1' },
  { id: 'machine-02', nom_machine: 'Robot de Soudure B-200', localisation: 'Atelier 2' },
  { id: 'machine-03', nom_machine: 'Tour CNC C-300', localisation: 'Atelier 1' },
  { id: 'machine-04', nom_machine: 'Ligne d\'assemblage D-400', localisation: 'Atelier 3' },
];

export const interventions: Intervention[] = [
  {
    id: 'int-001',
    machine: machines[0],
    agent: agents[1],
    type_probleme: 'matière',
    date_blocage: new Date('2024-07-20T08:15:00Z').toISOString(),
    date_deverrouillage: new Date('2024-07-20T08:30:00Z').toISOString(),
    statut: 'résolu',
  },
  {
    id: 'int-002',
    machine: machines[1],
    agent: agents[2],
    type_probleme: 'technique',
    date_blocage: new Date('2024-07-21T10:00:00Z').toISOString(),
    date_deverrouillage: new Date('2024-07-21T10:45:00Z').toISOString(),
    statut: 'résolu',
  },
  {
    id: 'int-003',
    machine: machines[3],
    agent: agents[2],
    type_probleme: 'technique',
    date_blocage: new Date('2024-07-22T14:30:00Z').toISOString(),
    date_deverrouillage: null,
    statut: 'en_cours',
  },
  {
    id: 'int-004',
    machine: machines[2],
    agent: agents[3],
    type_probleme: 'matière',
    date_blocage: new Date('2024-07-23T09:05:00Z').toISOString(),
    date_deverrouillage: new Date('2024-07-23T09:20:00Z').toISOString(),
    statut: 'résolu',
  },
  /*
  {
    id: 'int-005',
    machine: machines[0],
    agent: agents[4],
    type_probleme: 'câblage',
    date_blocage: new Date('2024-07-24T11:00:00Z').toISOString(),
    date_deverrouillage: null,
    statut: 'en_cours',
  }
  */
];
