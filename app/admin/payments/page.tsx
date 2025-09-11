"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PaymentsManagement } from "@/components/admin/payments-management";

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <PaymentsManagement />
      </AdminSidebar>
    </ProtectedRoute>
  );
}