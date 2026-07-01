import { Navigate } from "react-router-dom";

function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default RequireAdmin;
