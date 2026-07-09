import React from "react";
import { RouterProvider } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";
import AdminProvider from "./features/admin/context/admin.context.jsx";

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AdminProvider>
          <InterviewProvider>
            <RouterProvider router={router} />
          </InterviewProvider>
        </AdminProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
