import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Factory, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Factory className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            FaceID Factory Access
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {isAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.nom} ({user.role})
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link to="/login">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};