"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UserCheck, UserX, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyFaceId } from '@/ai/flows/face-id-verification';
import { useData } from '@/contexts/data-context';
import type { ProblemType } from '@/lib/types';

interface FaceIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (agentId: string) => void;
  problemType: ProblemType;
}

type VerificationStatus = 'idle' | 'capturing' | 'loading' | 'success' | 'error';

export function FaceIdModal({ isOpen, onClose, onUnlock, problemType }: FaceIdModalProps) {
  const { agents } = useData();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [capturedPhotoDataUri, setCapturedPhotoDataUri] = useState<string | null>(null);
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
          setStatus('capturing');
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Accès caméra refusé',
            description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
          });
          setStatus('idle');
        }
      };
      getCameraPermission();
    } else {
      // Stop camera stream when modal is closed
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [isOpen, toast]);

  const resetState = useCallback(() => {
    setSelectedAgentId('');
    setCapturedPhotoDataUri(null);
    setStatus('capturing');
    setResultMessage('');
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedPhotoDataUri(dataUri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedAgentId || !capturedPhotoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner un agent et scanner votre visage.',
      });
      return;
    }

    setStatus('loading');
    const selectedAgent = agents.find(agent => agent.id === selectedAgentId);
    if (!selectedAgent) {
        toast({ variant: 'destructive', title: 'Agent non trouvé' });
        setStatus('idle');
        return;
    }

    try {
      const result = await verifyFaceId({
        livePhotoDataUri: capturedPhotoDataUri,
        referencePhotoUrl: selectedAgent.photoUrl,
        problemType: problemType,
        userRole: selectedAgent.rôle as 'qualité' | 'maintenance',
      });
      
      setResultMessage(result.message);
      if (result.isAuthorized) {
        setStatus('success');
        setTimeout(() => {
          onUnlock(selectedAgent.id);
          handleClose();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setStatus('error');
      setResultMessage('Une erreur technique est survenue. Veuillez réessayer.');
    }
  };
  
  const relevantAgents = agents.filter(a => a.rôle === (problemType === 'technique' ? 'maintenance' : 'qualité'));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Vérification Face ID</DialogTitle>
          <DialogDescription className="text-center">
            Scannez votre visage pour déverrouiller la machine.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative flex justify-center items-center h-64 w-full mx-auto bg-muted rounded-md overflow-hidden border-2 border-dashed">
            <video ref={videoRef} className={`w-full h-full object-cover ${capturedPhotoDataUri ? 'hidden' : 'block'}`} autoPlay muted playsInline />
            {capturedPhotoDataUri && <img src={capturedPhotoDataUri} alt="Visage capturé" className="h-full w-full object-cover" />}
            <canvas ref={canvasRef} className="hidden" />
            {hasCameraPermission === false && (
                <div className="text-muted-foreground flex flex-col items-center text-center p-4">
                    <VideoOff className="h-16 w-16" />
                    <span className="text-sm mt-2">Caméra non disponible. Veuillez autoriser l'accès.</span>
                </div>
            )}
          </div>

           {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Accès Caméra Requis</AlertTitle>
                <AlertDescription>
                    Pour utiliser la vérification Face ID, veuillez autoriser l'accès à votre caméra dans les paramètres de votre navigateur.
                </AlertDescription>
            </Alert>
          )}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="agent-select">Simuler l'agent présent</Label>
             <Select value={selectedAgentId} onValueChange={setSelectedAgentId} disabled={status === 'loading'}>
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner un agent de ${problemType === 'technique' ? 'maintenance' : 'qualité'}`} />
              </SelectTrigger>
              <SelectContent>
                {relevantAgents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.nom} ({agent.rôle})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === 'capturing' && capturedPhotoDataUri && (
             <Button variant="outline" onClick={() => setCapturedPhotoDataUri(null)} disabled={status === 'loading'}>
                Reprendre la photo
            </Button>
          )}

           {status === 'capturing' && !capturedPhotoDataUri && (
             <Button onClick={handleCapture} disabled={!hasCameraPermission || status === 'loading'}>
                <Video className="mr-2 h-4 w-4" />
                Scanner le visage
            </Button>
          )}
          
          {status === 'loading' && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Vérification en cours...</span>
            </div>
          )}


          {status === 'success' && (
            <Alert variant="default" className="bg-green-100 dark:bg-green-900/50 border-green-500">
              <UserCheck className="h-4 w-4 text-green-500" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>{resultMessage}</AlertDescription>
            </Alert>
          )}
          {status === 'error' && (
            <Alert variant="destructive">
              <UserX className="h-4 w-4" />
              <AlertTitle>Échec de la vérification</AlertTitle>
              <AlertDescription>{resultMessage}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={status === 'loading'}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={status === 'loading' || status === 'success' || !selectedAgentId || !capturedPhotoDataUri}>
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Vérifier et Déverrouiller
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
