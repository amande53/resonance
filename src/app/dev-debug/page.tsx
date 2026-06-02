"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardView } from "@/features/dashboard/views/dashboard-view";

export default function DebugDashboard() {
  return (
    <SidebarProvider defaultOpen={false} className="h-svh">
      <main className="min-h-screen">
        <DashboardView />
      </main>
    </SidebarProvider>
  );
}
