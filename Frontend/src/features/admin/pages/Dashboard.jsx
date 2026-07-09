import { useEffect, useState } from "react";

import {
  Users,
  FileText,
  Activity,
  Bot,
  HardDrive,
  TrendingUp,
  UserCheck,
  Sparkles,
} from "lucide-react";

import StatCard from "../components/StatCard";
import RecentUsers from "../components/RecentUsers";
import RecentReports from "../components/RecentReports";
import OverviewWidgets from "../components/OverviewWidgets";

import { useAdmin } from "../hooks/useAdmin";
import { getDashboard } from "../services/admin.api";
import DashboardAnalytics from "../components/DashboardAnalytics";
import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  const { admin } = useAdmin();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageRefresh, setPageRefresh] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await getDashboard();

      setDashboard(data.dashboard);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    setPageRefresh(false);
  }, [pageRefresh]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    );
  }
  if (!dashboard) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-400">
        Failed to load dashboard.
      </div>
    );
  }

  const cards = dashboard.cards;

  return (
    <>
      <Helmet>
        <title>Super Admin Dashboard | InterviewGen AI</title>

        <meta
          name="description"
          content="Super Admin dashboard for InterviewGen AI. Monitor users, interview reports, analytics, AI usage, storage, subscriptions, system health, and platform performance from a centralized admin panel."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, Super Admin Dashboard, Admin Panel, User Management, Report Management, Analytics, AI Usage, System Monitoring"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href="https://your-domain.com/admin" />
      </Helmet>
      <div className="w-[100%] p-6 lg:p-8">
        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold lg:text-4xl">
            Welcome Back {admin?.name} 👋
          </h1>

          <p className="mt-2 text-zinc-400">Here's what's happening today.</p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={cards.totalUsers} icon={Users} />

          <StatCard
            title="Reports"
            value={cards.totalReports}
            icon={FileText}
          />

          <StatCard
            title="Today's Reports"
            value={cards.todayReports}
            icon={Activity}
          />

          <StatCard title="AI Requests" value={cards.aiRequests} icon={Bot} />

          <StatCard
            title="Storage Used"
            value={`${cards.storageUsed} MB`}
            icon={HardDrive}
          />

          <StatCard
            title="Verified Users"
            value={cards.verifiedUsers}
            icon={TrendingUp}
          />

          <StatCard
            title="Active Users"
            value={cards.activeUsers}
            icon={UserCheck}
          />

          <StatCard
            title="Success Rate"
            value={`${cards.averageMatchScore}%`}
            icon={Sparkles}
          />
        </div>

        {/* Analytics */}

        <div className="mt-8">
          <DashboardAnalytics charts={dashboard.graphs} />
        </div>

        {/* Recent */}

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <RecentUsers users={dashboard.recentUsers} />

          <RecentReports reports={dashboard.recentReports} />
        </div>

        {/* Widgets */}

        <div className="mt-8 pb-8">
          <OverviewWidgets
            cards={dashboard.cards}
            setPageRefresh={setPageRefresh}
            systemHealth={dashboard.systemHealth}
          />
        </div>
      </div>
    </>
  );
}
