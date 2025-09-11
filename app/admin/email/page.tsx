"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { EmailManagement } from "@/components/admin/email-management";

export default function AdminEmailPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <EmailManagement />
      </AdminSidebar>
    </ProtectedRoute>
  );
}