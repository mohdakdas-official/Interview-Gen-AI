import { Navigate } from "react-router";
import { useAdmin } from "../hooks/useAdmin";

export default function AdminProtected({ children }) {
  const { loading, isAuthenticated } = useAdmin();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        Wait, Redirecting...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/IGAI-admin/login" replace />;
  }

  return children;
}
