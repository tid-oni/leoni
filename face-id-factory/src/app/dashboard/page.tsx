"use client";

import { useAuth } from "@/hooks/use-auth";
import AdminDashboard from "@/components/admin-dashboard";
import AgentDashboard from "@/components/agent-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // Layout should handle redirect
  }

  return (
    <div className="container mx-auto py-8">
      {user.rôle === "admin" ? <AdminDashboard /> : <AgentDashboard user={user} />}
    </div>
  );
}
