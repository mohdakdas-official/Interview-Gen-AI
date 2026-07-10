import "../styles/admin.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";

export default function DashboardAnalytics({ charts }) {
  return (
    <div className="mt-10 grid w-full gap-6 lg:grid-cols-2">
      {/* Reports */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Reports Overview</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Generated reports this week
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.reportGraph}>
              <defs>
                <linearGradient
                  id="reportsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#27272a" />

              <XAxis dataKey="day" stroke="#a1a1aa" />

              <YAxis stroke="#a1a1aa" />

              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 10,
                }}
              />

              <Area
                dataKey="reports"
                stroke="#3b82f6"
                fill="url(#reportsGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Users Overview</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Registered users this week
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.monthlyUsers}>
              <CartesianGrid stroke="#27272a" />

              <XAxis dataKey="day" stroke="#a1a1aa" />

              <YAxis stroke="#a1a1aa" />

              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 10,
                }}
              />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
