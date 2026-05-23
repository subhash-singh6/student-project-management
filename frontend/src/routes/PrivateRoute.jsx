import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/PageLoader";
import { getDashboardPath } from "../utils/role";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}