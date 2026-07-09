import { Navigate } from "react-router";
import { useAuth } from "./features/auth/hooks/useAuth";

const PublicRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  // if (loading) {
  //   return <div>Wait, Redirecting...</div>;
  // }

  return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoutes;
