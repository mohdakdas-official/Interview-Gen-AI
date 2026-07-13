import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import PublicRoutes from "./PublicRoutes";
import AdminLayout from "./features/admin/layout/AdminLayout";
import Dashboard from "./features/admin/pages/Dashboard";
import Users from "./features/admin/pages/Users";
import Reports from "./features/admin/pages/Reports";
import Analytics from "./features/admin/pages/Analytics";
import AIUsage from "./features/admin/pages/AIUsage";
import Subscription from "./features/admin/pages/Subscription";
import Settings from "./features/admin/pages/Settings";
import AdminLogin from "./features/admin/pages/AdminLogin";
import AdminProtected from "./features/admin/components/AdminProtected";
import AdminPublicRoute from "./features/admin/components/AdminPublicRoutes";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import AdminProvider from "./features/admin/context/admin.context";
import LandingLayout from "./main-landing/layout/LandingLayout";
import LandingHome from "./main-landing/pages/LandingHome";
import PrivacyPolicy from "./main-landing/pages/PrivacyPolicy";
import TermsOfService from "./main-landing/pages/TermsOfService";
import HelpCenter from "./main-landing/pages/HelpCenter";
import NotFound from "./main-landing/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoutes>
        <Login />
      </PublicRoutes>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoutes>
        <Register />
      </PublicRoutes>
    ),
  },
  {
    path: "/create",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/IGAI-admin",
    element: (
      <AdminProvider>
        <AdminProtected>
          <AdminLayout />
        </AdminProtected>
      </AdminProvider>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "ai-usage",
        element: <AIUsage />,
      },
      {
        path: "subscription",
        element: <Subscription />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/IGAI-admin/login",
    element: (
      <AdminPublicRoute>
        <AdminLogin />
      </AdminPublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <LandingHome />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfService />,
      },
      {
        path: "help-center",
        element: <HelpCenter />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
