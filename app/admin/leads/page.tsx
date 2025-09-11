"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LeadsManagement } from "@/components/admin/leads-management";

export default function AdminLeadsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <LeadsManagement />
      </AdminSidebar>
    </ProtectedRoute>
  );
}