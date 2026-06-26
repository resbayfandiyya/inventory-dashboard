import { Navigate } from "react-router-dom";

export default function RoleRoute({
  children,
  roles,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}