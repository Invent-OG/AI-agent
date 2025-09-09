"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { StudentDashboard } from "@/components/student/student-dashboard";

export default function StudentPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  );
}
