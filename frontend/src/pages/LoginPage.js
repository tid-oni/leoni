import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: result.error,
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="container relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="mt-4 text-center flex flex-col items-center">
            <div className="flex items-center justify-center text-lg font-medium mb-4 text-blue-700 dark:text-white">
              <Factory className="mr-2 h-6 w-6 text-blue-700 dark:text-white" />
              FaceID Factory Access
            </div>
            <blockquote className="space-y-2 text-blue-700 dark:text-white">
              <p className="text-lg">
                &ldquo;La sécurité et l'efficacité ne sont pas des options, ce sont des standards.&rdquo;
              </p>
              <footer className="text-sm">Leoni Group</footer>
            </blockquote>
          </div>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Connexion
              </CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Comptes de test :</p>
            <p>Admin: admin@leoni.com / admin123</p>
            <p>Qualité: qualite1@leoni.com / password123</p>
            <p>Maintenance: maintenance1@leoni.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};