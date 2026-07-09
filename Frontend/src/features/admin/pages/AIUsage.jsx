import { Helmet } from "react-helmet-async";
import {
  Bot,
  Activity,
  Clock3,
  AlertTriangle,
  Coins,
  Cpu,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getAIUsage } from "../services/admin.api";

export default function AIUsage() {
  const [aiUsage, setAIUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAIUsage = async () => {
    try {
      const { data } = await getAIUsage();

      setAIUsage(data.aiUsage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAIUsage();
  }, []);
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    );
  }
  if (!aiUsage) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-400">
        Failed to load AI Usage.
      </div>
    );
  }

  const cards = aiUsage.cards;
  const usage = aiUsage.usage;
  const health = aiUsage.systemHealth;
  const recentRequests = aiUsage.recentRequests;
  const TOTAL_STORAGE = 500;
  const storagePercentage = Math.min(
    (cards.storageUsed / TOTAL_STORAGE) * 100,
    100,
  );
  const storageColor =
    storagePercentage < 60
      ? "bg-green-500"
      : storagePercentage < 85
        ? "bg-yellow-500"
        : "bg-red-500";

  const REQUEST_LIMIT = 10000;

  const percentage = Math.min((cards.totalRequests / REQUEST_LIMIT) * 100, 100);

  const progressColor =
    percentage >= 80
      ? "bg-red-500"
      : percentage >= 60
        ? "bg-yellow-500"
        : percentage >= 30
          ? "bg-blue-500"
          : "bg-green-500";

  return (
    <>
    <Helmet>
  <title>AI Usage | InterviewGen AI</title>

  <meta
    name="description"
    content="Monitor AI usage and Gemini API performance from the Super Admin dashboard. Track AI requests, response times, estimated costs, token consumption, success rates, and recent AI activities."
  />

  <meta
    name="keywords"
    content="InterviewGen AI, AI Usage, Gemini API, AI Analytics, Token Usage, API Performance, Admin Dashboard, AI Monitoring"
  />

  <meta name="author" content="InterviewGen AI" />
  <meta name="robots" content="noindex, nofollow" />

  <link
    rel="canonical"
    href="https://your-domain.com/admin/ai-usage"
  />
</Helmet>
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold">AI Usage</h1>

          <p className="mt-2 text-zinc-400">
            Monitor Gemini API usage and AI performance.
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Bot className="mb-5 text-blue-500" />

            <p className="text-zinc-400">Total Requests</p>

            <h2 className="mt-2 text-4xl font-bold"> {cards.totalRequests}</h2>

            <span className="text-green-400">--</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Clock3 className="mb-5 text-green-500" />

            <p className="text-zinc-400">Avg Response</p>

            <h2 className="mt-2 text-4xl font-bold">Coming Soon</h2>
            <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>

            <span className="text-green-400">--</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Coins className="mb-5 text-yellow-500" />

            <p className="text-zinc-400">Estimated Cost</p>

            <h2 className="mt-2 text-4xl font-bold">Coming Soon</h2>
            <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>

            <span className="text-zinc-400">--</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <AlertTriangle className="mb-5 text-red-500" />

            <p className="text-zinc-400">Failed Requests</p>

            <h2 className="mt-2 text-4xl font-bold">Comin Soon</h2>
            <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>

            <span className="text-red-400">--</span>
          </div>
        </div>

        {/* Usage */}

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Request Usage</h2>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex justify-between">
                  <span>Storage Used</span>
                  <span>
                    {cards.storageUsed} MB / {TOTAL_STORAGE} MB
                  </span>
                </div>

                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${storageColor}`}
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span>Interview Report</span>
                  <span>
                    {cards.totalRequests} / {REQUEST_LIMIT}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* <div>
              <div className="mb-2 flex justify-between">
                <span>Chat Requests</span>
                <span>1,470</span>
              </div>

              <div className="h-2 rounded-full bg-zinc-800">
                <div className="h-full w-[35%] rounded-full bg-purple-500"></div>
              </div>
            </div> */}
            </div>
          </div>

          {/* Token Usage */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden">
            <h2 className="mb-6 text-xl font-semibold">Token Usage</h2>

            <div className="min-h-20 relative space-y-5 flex items-center justify-center ">
              {/* <div className="flex justify-between">
              <span>Input Tokens</span>
              <span>1.8M</span>
            </div>

            <div className="flex justify-between">
              <span>Output Tokens</span>
              <span>940K</span>
            </div>

            <div className="flex justify-between">
              <span>Total Tokens</span>
              <span>2.74M</span>
            </div>

            <div className="flex justify-between">
              <span>Average / Request</span>
              <span>214</span>
            </div> */}
              <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>
              <span className=" font-bold   text-2xl">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Health */}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <Cpu className="mb-4 text-cyan-500" />

            <h3 className="text-lg font-semibold">Gemini API</h3>

            <p className="mt-4 text-green-400">
              {health.api ? "Healthy" : "Unhealthy"}
            </p>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden">
            <Activity className="mb-4 text-green-500  " />

            <h3 className="  text-lg font-semibold">Success Rate</h3>

            <p className="mt-4  text-4xl font-bold">Coming Soon</p>
            <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden">
            <TrendingUp className="mb-4 text-blue-500" />

            <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>
            <h3 className="text-lg font-semibold">Daily Growth</h3>

            <p className="mt-4   text-4xl font-bold">Comin Soon</p>
          </div>
        </div>

        {/* Logs */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-800 p-5">
            <h2 className="text-xl font-semibold">Recent AI Requests</h2>
          </div>

          <div className="relative min-h-30 p-5 divide-y divide-zinc-800 flex items-center justify-center ">
            {/* {[
            "Resume Analysis",
            "Interview Report",
            "Behavior Questions",
            "Technical Questions",
            "Preparation Plan",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-5 hover:bg-zinc-800/40"
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-500" />

                <div>
                  <p>{item}</p>

                  <span className="text-sm text-zinc-500">
                    Completed successfully
                  </span>
                </div>
              </div>

              <span className="text-zinc-500">2 min ago</span>
            </div>
          ))} */}
            <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-90 "></div>
            <span className=" font-bold   text-2xl">Coming Soon</span>
          </div>
        </div>
      </div>
    </>
  );
}
