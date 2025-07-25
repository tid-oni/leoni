"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Agent } from "@/lib/types";
import { useData, DataProvider } from "./data-context";

interface AuthContextType {
  isAuthenticated: boolean;
  user: Agent | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A wrapper component to allow AuthProvider to use the useData hook
function AuthProviderContent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { agents } = useData(); // Use the live agent data from the context

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        // Ensure the stored user is still valid against the current agent list
        const parsedUser = JSON.parse(storedUser);
        const currentUserInList = agents.find(a => a.id === parsedUser.id);
        if (currentUserInList) {
          setUser(currentUserInList);
        } else {
           sessionStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, [agents]); // Rerun if agents list changes

  const login = async (email: string, mot_de_passe: string): Promise<boolean> => {
    // Use the dynamic list of agents from the DataContext
    const foundUser = agents.find(
      (agent) => agent.email === email && agent.mot_de_passe === mot_de_passe
    );
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem("user", JSON.stringify(foundUser));
      router.push("/dashboard");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </DataProvider>
  )
}
