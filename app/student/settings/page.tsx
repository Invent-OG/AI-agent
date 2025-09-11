"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentSettings } from "@/components/student/student-settings";

export default function StudentSettingsPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentSidebar>
        <StudentSettings />
      </StudentSidebar>
    </ProtectedRoute>
  );
}