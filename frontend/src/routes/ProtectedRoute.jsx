
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles = [],
}) {
  const { isAuthenticated, user } = useAuth();

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize user role
  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

  // Check role-based authorization
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render protected child routes
  return <Outlet />;
}
