'use client';

import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AddEditAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  agent: Agent | null;
}

const agentSchema = z.object({
  nom: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  rôle: z.enum(['qualité', 'maintenance']),
  mot_de_passe: z.string().min(8, 'Password must be at least 8 characters.'),
  photoUrl: z.string().optional().or(z.literal('')),
});

type AgentFormValues = z.infer<typeof agentSchema>;

export function AddEditAgentDialog({ isOpen, onClose, onSave, agent }: AddEditAgentDialogProps) {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      nom: '',
      email: '',
      rôle: 'qualité',
      mot_de_passe: '',
      photoUrl: 'https://placehold.co/128x128.png'
    },
  });

  const photoUrl = form.watch('photoUrl');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (agent) {
      form.reset({
        nom: agent.nom,
        email: agent.email,
        rôle: agent.rôle as 'qualité' | 'maintenance',
        mot_de_passe: agent.mot_de_passe,
        photoUrl: agent.photoUrl,
      });
    } else {
      form.reset({
        nom: '',
        email: '',
        rôle: 'qualité',
        mot_de_passe: '',
        photoUrl: 'https://placehold.co/128x128.png',
      });
    }
  }, [agent, form, isOpen]);

  const handleSubmit = (values: AgentFormValues) => {
    const agentData: Agent = {
      ...(agent || { id: '', face_encoding: `encoding_${Date.now()}` }),
      ...values,
      rôle: values.rôle,
      photoUrl: values.photoUrl || 'https://placehold.co/128x128.png',
    };
    onSave(agentData);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{agent ? 'Edit Agent' : 'Add Agent'}</DialogTitle>
          <DialogDescription>
            {agent ? "Update the agent's details." : "Create a new agent profile."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mot_de_passe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rôle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="qualité">Qualité</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Photo</FormLabel>
              <div className="flex items-center gap-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={photoUrl} alt="Agent Photo Preview" data-ai-hint="person portrait" />
                    <AvatarFallback className="text-3xl">?</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Upload Photo
                </Button>
                <Input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
