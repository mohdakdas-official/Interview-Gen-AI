import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { adminVerify } from "../services/admin.api";

export default function AdminPublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await adminVerify();
        setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) return null;

  if (isAdmin) {
    return <Navigate to="/IGAI-admin" replace />;
  }

  return children;
}
