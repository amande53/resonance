"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardView } from "@/features/dashboard/views/dashboard-view";

export default function DebugDashboard() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false} className="h-svh">
      <main>
        <DashboardView />
      </main>
    </SidebarProvider>
  );
}
