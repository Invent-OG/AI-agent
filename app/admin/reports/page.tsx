"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ReportsManagement } from "@/components/admin/reports-management";

export default function AdminReportsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <ReportsManagement />
      </AdminSidebar>
    </ProtectedRoute>
  );
}