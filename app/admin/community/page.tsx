"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CommunityManagement } from "@/components/admin/community-management";

export default function AdminCommunityPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <CommunityManagement />
      </AdminSidebar>
    </ProtectedRoute>
  );
}