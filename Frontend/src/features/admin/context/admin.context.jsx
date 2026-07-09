import { createContext, useEffect, useState } from "react";
import { adminVerify, adminLogout } from "../services/admin.api";

export const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    try {
      const { data } = await adminVerify();

      if (data.success) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error(error);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        loading,
        fetchAdmin,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
