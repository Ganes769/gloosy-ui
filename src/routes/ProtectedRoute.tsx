// ProtectedRoute.tsx

import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import type { ReactElement } from "react";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { status } = useAuth();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <Navigate to="/login" replace />;

  return children;
}
