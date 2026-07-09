import { Helmet } from "react-helmet-async";
import {
  TrendingUp,
  Users,
  FileText,
  Bot,
  HardDrive,
  Target,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAnalytics } from "../services/admin.api";

import Analytics from "../components/Analytics";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const { data } = await getAnalytics();

      setAnalytics(data.analytics);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-400">
        Failed to load analytics.
      </div>
    );
  }
  const match = analytics.distributions.matchScoreDistribution;

  const score90to100 = match.find((item) => item._id === 90)?.total || 0;

  const score80to89 = match.find((item) => item._id === 80)?.total || 0;

  const score70to79 = match.find((item) => item._id === 70)?.total || 0;

  const below70 = match.find((item) => item._id === 0)?.total || 0;
  return (
    <>
      <Helmet>
        <title>Analytics | InterviewGen AI</title>

        <meta
          name="description"
          content="Analyze platform performance from the Super Admin dashboard. Monitor user growth, report generation trends, match score distribution, skill gap insights, and overall system analytics."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, Analytics, Admin Analytics, User Growth, Report Analytics, Match Score Analytics, Skill Gap Analysis, Dashboard"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href="https://your-domain.com/admin/analytics" />
      </Helmet>
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>

          <p className="mt-2 text-zinc-400">
            Monitor platform performance and AI usage.
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Users className="mb-4 text-blue-500" />
            <p className="text-zinc-400">Total Users</p>
            <h2 className="mt-2 text-4xl font-bold">
              {analytics.cards.totalUsers}
            </h2>
            <span className="text-green-400 text-sm">Generated reports</span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <FileText className="mb-4 text-purple-500" />
            <p className="text-zinc-400">Reports</p>
            <h2 className="mt-2 text-4xl font-bold">
              {analytics.cards.totalReports}
            </h2>
            <span className="text-green-400 text-sm">Registered users</span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Bot className="mb-4 text-cyan-500" />
            <p className="text-zinc-400">AI Requests</p>
            <h2 className="mt-2 text-4xl font-bold">
              {analytics.cards.aiRequests}
            </h2>
            <span className="text-green-400 text-sm">
              Total Gemini requests
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <TrendingUp className="mb-4 text-green-500" />
            <p className="text-zinc-400">Average Match Score</p>
            <h2 className="mt-2 text-4xl font-bold">
              {analytics.cards.averageMatchScore}%
            </h2>
            <span className="text-green-400 text-sm">Across all reports</span>
          </div>
        </div>

        {/* Charts */}
        <Analytics charts={analytics.charts} />

        {/* Bottom Grid */}

        <div className="grid gap-6 xl:grid-cols-3">
          {/* AI Usage */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Bot className="mb-5 text-blue-500" />

            <h3 className="text-xl font-semibold">AI Usage</h3>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between">
                  <span>Gemini Requests</span>
                  <span>{analytics.cards.aiRequests}</span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(
                        (analytics.cards.aiRequests / 10000) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Average Match</span>
                  <span>{analytics.cards.averageMatchScore}%</span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${analytics.cards.averageMatchScore}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Storage */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <HardDrive className="mb-5 text-orange-500" />

            <h3 className="text-xl font-semibold">Storage</h3>

            <p className="mt-6 text-4xl font-bold">
              {analytics.cards.storageUsed} MB
            </p>

            <p className="mt-2 text-zinc-400">Used of 500 MB</p>

            <div className="mt-6 h-2 rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{
                  width: `${(analytics.cards.storageUsed / 500) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Health */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Activity className="mb-5 text-green-500" />

            <h3 className="text-xl font-semibold">System Health</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span>Server</span>

                <span
                  className={
                    analytics.systemHealth.server
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {analytics.systemHealth.server ? "Running" : "Offline"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Database</span>

                <span
                  className={
                    analytics.systemHealth.database
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {analytics.systemHealth.database
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>API</span>

                <span
                  className={
                    analytics.systemHealth.api
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {analytics.systemHealth.api ? "Healthy" : "Down"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Score */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Target className="text-blue-500" />

            <h2 className="text-xl font-semibold">Match Score Distribution</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-zinc-950 p-5">
              <p className="text-zinc-400">90-100%</p>
              <h3 className="mt-2 text-3xl font-bold">{score90to100}</h3>
            </div>

            <div className="rounded-xl bg-zinc-950 p-5">
              <p className="text-zinc-400">80-89%</p>

              <h3 className="mt-2 text-3xl font-bold">{score80to89}</h3>
            </div>

            <div className="rounded-xl bg-zinc-950 p-5">
              <p className="text-zinc-400">70-79%</p>

              <h3 className="mt-2 text-3xl font-bold">{score70to79}</h3>
            </div>

            <div className="rounded-xl bg-zinc-950 p-5">
              <p className="text-zinc-400">Below 70%</p>

              <h3 className="mt-2 text-3xl font-bold">{below70}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
