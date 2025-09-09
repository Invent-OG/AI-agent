"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { FuturisticDashboard } from "@/components/admin/futuristic-dashboard";

export default function WorkshopAdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <FuturisticDashboard />
    </ProtectedRoute>
  );
}
