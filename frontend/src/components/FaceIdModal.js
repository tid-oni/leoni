import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, UserCheck, UserX, Video, VideoOff } from 'lucide-react';
import { agentService, faceRecognitionService } from '../services/api';
import { useToast } from '../hooks/use-toast';

export const FaceIdModal = ({ isOpen, onClose, onUnlock, problemType, machineId }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [capturedPhotoDataUri, setCapturedPhotoDataUri] = useState(null);
  const [status, setStatus] = useState('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const { toast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadAgents();
      getCameraPermission();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const loadAgents = async () => {
    try {
      const response = await agentService.getAgents();
      const relevantAgents = response.data.filter(agent => 
        agent.role === (problemType === 'technique' ? 'maintenance' : 'qualité') || 
        agent.role === 'admin'
      );
      setAgents(relevantAgents);
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    }
  };

  const getCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
      setStatus('capturing');
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Accès caméra refusé',
        description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
      });
      setStatus('idle');
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const resetState = useCallback(() => {
    setSelectedAgentId('');
    setCapturedPhotoDataUri(null);
    setStatus('capturing');
    setResultMessage('');
  }, []);

  const handleClose = () => {
    resetState();
    stopCamera();
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

    try {
      const response = await faceRecognitionService.verifyFaceId({
        live_photo: capturedPhotoDataUri,
        agent_id: parseInt(selectedAgentId),
        problem_type: problemType,
        machine_id: machineId,
      });

      setResultMessage(response.data.message);
      if (response.data.is_authorized) {
        setStatus('success');
        setTimeout(() => {
          onUnlock();
          handleClose();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setStatus('error');
      setResultMessage(
        error.response?.data?.message || 
        'Une erreur technique est survenue. Veuillez réessayer.'
      );
    }
  };

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
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover ${capturedPhotoDataUri ? 'hidden' : 'block'}`} 
              autoPlay 
              muted 
              playsInline 
            />
            {capturedPhotoDataUri && (
              <img 
                src={capturedPhotoDataUri} 
                alt="Visage capturé" 
                className="h-full w-full object-cover" 
              />
            )}
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
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.nom} ({agent.role})
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
          <Button variant="outline" onClick={handleClose} disabled={status === 'loading'}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={status === 'loading' || status === 'success' || !selectedAgentId || !capturedPhotoDataUri}
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Vérifier et Déverrouiller
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};