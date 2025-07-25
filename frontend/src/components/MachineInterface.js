import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Wrench, HardHat, ShieldCheck, ShieldAlert, Zap, Box } from 'lucide-react';
import { FaceIdModal } from './FaceIdModal';
import { machineService } from '../services/api';

export const MachineInterface = () => {
  const [status, setStatus] = useState('ok');
  const [machines, setMachines] = useState([]);
  const [currentMachineIndex, setCurrentMachineIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problemType, setProblemType] = useState(null);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await machineService.getMachines();
      setMachines(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des machines:', error);
    }
  };

  const simulateProblem = (type) => {
    const statusMap = {
      technique: 'locked-technique',
      matière: 'locked-matiere',
    };
    setStatus(statusMap[type]);
    setProblemType(type);
    setCurrentMachineIndex((prev) => (prev + 1) % machines.length);
  };

  const handleUnlock = () => {
    setStatus('ok');
    setIsModalOpen(false);
    setProblemType(null);
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'locked-technique':
        return {
          title: 'Problème Technique Détecté',
          message: 'Attente Face ID d\'un agent de maintenance',
          icon: <Wrench className="h-16 w-16 text-destructive" />,
        };
      case 'locked-matiere':
        return {
          title: 'Problème Matière Détecté',
          message: 'Attente Face ID d\'un agent qualité',
          icon: <HardHat className="h-16 w-16 text-yellow-500" />,
        };
      default:
        return {
          title: 'Système Opérationnel',
          message: 'Aucun problème détecté. La machine est déverrouillée.',
          icon: <ShieldCheck className="h-16 w-16 text-green-500" />,
        };
    }
  };

  const { title, message, icon } = getStatusInfo();
  const currentMachine = machines[currentMachineIndex];

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            Contrôle Machine: {currentMachine?.nom_machine || 'Machine de test'}
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
              <h3 className="text-center font-semibold text-muted-foreground mb-4 max-w-md">
                PANNEAU DE SIMULATION
              </h3>
              <p className="text-sm text-center text-muted-foreground mb-4 max-w-md">
                Utilisez ces boutons pour simuler une panne machine et tester le flux de déverrouillage Face ID.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
                <Button 
                  variant="destructive" 
                  onClick={() => simulateProblem('technique')}
                >
                  <Zap className="mr-2 h-4 w-4" /> 
                  Simuler Panne Technique
                </Button>
                <Button 
                  variant="outline" 
                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  onClick={() => simulateProblem('matière')}
                >
                  <Box className="mr-2 h-4 w-4" /> 
                  Simuler Panne Matière
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
          machineId={currentMachine?.id || 1}
        />
      )}
    </div>
  );
};