"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSettings } from "@/components/admin/admin-settings";

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <AdminSettings />
      </AdminSidebar>
    </ProtectedRoute>
  );
}