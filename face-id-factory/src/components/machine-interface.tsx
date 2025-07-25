"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Wrench, HardHat, ShieldCheck, ShieldAlert, Zap, Box } from 'lucide-react';
import { FaceIdModal } from './face-id-modal';
import type { ProblemType } from '@/lib/types';
import { Separator } from './ui/separator';
import { useData } from '@/contexts/data-context';
import { machines } from '@/lib/data';

type MachineStatus = 'ok' | 'locked-technique' | 'locked-matiere';

export function MachineInterface() {
  const [status, setStatus] = useState<MachineStatus>('ok');
  const [currentMachineIndex, setCurrentMachineIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addIntervention, agents } = useData();

  const simulateProblem = (problem: ProblemType) => {
    const statusMap: Record<ProblemType, MachineStatus> = {
      technique: 'locked-technique',
      matière: 'locked-matiere',
    };
    setStatus(statusMap[problem]);
    setCurrentMachineIndex((prev) => {
      const nextIndex = (prev + 1) % machines.length;
      return nextIndex;
    });
  };

  const handleUnlock = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) {
      console.error("Agent not found for unlock process");
      return;
    }

    const machine = machines[currentMachineIndex];
    const problemTypeMap: Record<MachineStatus, ProblemType | null> = {
      'locked-technique': 'technique',
      'locked-matiere': 'matière',
      'ok': null,
    };
    const problemType = problemTypeMap[status];

    if (problemType === null) {
      console.error("No problem type for current status, cannot add intervention");
      return;
    }

    addIntervention({
      id: `int-${Date.now()}`,
      machine: machine,
      agent: agent,
      type_probleme: problemType,
      date_blocage: new Date().toISOString(),
      date_deverrouillage: new Date().toISOString(),
      statut: 'résolu',
    });

    setStatus('ok');
    setIsModalOpen(false);
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'locked-technique':
        return {
          title: 'Problème Technique Détecté',
          message: 'Attente Face ID d’un agent de maintenance',
          icon: <Wrench className="h-16 w-16 text-destructive" />,
          problemType: 'technique' as ProblemType,
        };
      case 'locked-matiere':
        return {
          title: 'Problème Matière Détecté',
          message: 'Attente Face ID d’un agent qualité',
          icon: <HardHat className="h-16 w-16 text-yellow-500" />,
          problemType: 'matière' as ProblemType,
        };
      default:
        return {
          title: 'Système Opérationnel',
          message: 'Aucun problème détecté. La machine est déverrouillée.',
          icon: <ShieldCheck className="h-16 w-16 text-green-500" />,
          problemType: null,
        };
    }
  };

  const { title, message, icon, problemType } = getStatusInfo();

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            Contrôle Machine: {machines[currentMachineIndex].nom_machine}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10 space-y-6">
          <div className="p-6 bg-secondary rounded-full">
            {icon}
          </div>
          <h2 className="text-2xl font-semibold text-center">{title}</h2>
          <p className="text-muted-foreground text-center">{message}</p>

          {status !== 'ok' && (
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <ShieldAlert className="mr-2 h-5 w-5" />
              Déverrouiller avec Face ID
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-6 pt-1 pb-6">
          {status === 'ok' && (
            <>
              <h3 className="text-center font-semibold text-muted-foreground mb-4 max-w-md">PANNEAU DE SIMULATION</h3>
              <p className="text-sm text-center text-muted-foreground mb-4 max-w-md">
                Utilisez ces boutons pour simuler une panne machine et tester le flux de déverrouillage Face ID.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md whitespace-normal">
                <Button variant="destructive" className="break-words" onClick={() => simulateProblem('technique')}>
                  <Zap className="mr-2 h-4 w-4" /> Simuler Panne Technique
                </Button>
                <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 break-words" onClick={() => simulateProblem('matière')}>
                  <Box className="mr-2 h-4 w-4" /> Simuler Panne Matière
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
      {problemType && (
        <FaceIdModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUnlock={handleUnlock}
          problemType={problemType}
        />
      )}
    </div>
  );
}
