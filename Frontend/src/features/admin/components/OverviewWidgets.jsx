import "../styles/admin.css";

import {
  Bot,
  HardDrive,
  Cpu,
  FileDown,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router";

export default function OverviewWidgets({
  cards,
  setPageRefresh,
  systemHealth,
}) {
  const MONTHLY_LIMIT = 10000;
  const TOTAL_STORAGE = 512;

  const usedPercentage = Math.min(
    (cards.aiRequests / MONTHLY_LIMIT) * 100,
    100,
  );
  const storagePercentage = Math.min(
    (cards.storageUsed / TOTAL_STORAGE) * 100,
    100,
  );

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
      {/* AI Usage */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">AI Usage</h3>
          <Bot className="text-blue-400" />
        </div>

        <h2 className="mt-5 text-3xl font-bold">{cards.aiRequests}</h2>

        <p className="mt-2 text-sm text-zinc-400">Gemini requests this month</p>

        <div className="mt-5 h-2 rounded-full bg-zinc-800">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${usedPercentage}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          {usedPercentage.toFixed(1)}% of monthly quota used
        </p>
      </div>

      {/* Storage */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Storage</h3>
          <HardDrive className="text-green-400" />
        </div>

        <h2 className="mt-5 text-3xl font-bold">{cards.storageUsed}</h2>

        <p className="mt-2 text-sm text-zinc-400">Used of {TOTAL_STORAGE} MB</p>

        <div className="mt-5 h-2 rounded-full bg-zinc-800">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${storagePercentage}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          Plenty of storage available
        </p>
      </div>

      {/* System Health */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">System Health</h3>
          <Cpu className="text-orange-400" />
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">API</span>
            <span
              className={systemHealth.api ? "text-green-400" : "text-red-400"}
            >
              {systemHealth.api ? "Operational" : "Offline"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Database</span>
            <span
              className={
                systemHealth.database ? "text-green-400" : "text-red-400"
              }
            >
              {systemHealth.database ? "Healthy" : "Disconnected"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Server</span>
            <span
              className={
                systemHealth.server ? "text-green-400" : "text-red-400"
              }
            >
              {systemHealth.server ? "Running" : "Stopped"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="mb-5 font-semibold">Quick Actions</h3>

        <div className="space-y-3">
          <button
            onClick={() => setPageRefresh((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700 cursor-pointer"
          >
            <RefreshCw size={18} />
            Refresh Analytics
          </button>

          <NavLink
            to={"/IGAI-admin/reports"}
            className="flex w-full items-center gap-3 rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700 cursor-pointer"
          >
            <FileDown size={18} />
            Manage Reports
          </NavLink>

          <NavLink
            to={"/IGAI-admin/users"}
            className="flex w-full items-center gap-3 rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700 cursor-pointer"
          >
            <Users size={18} />
            Manage Users
          </NavLink>

          <NavLink
            to={"/IGAI-admin/settings"}
            className="flex w-full items-center gap-3 rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700 cursor-pointer"
          >
            <ShieldCheck size={18} />
            Security Settings
          </NavLink>
        </div>
      </div>
    </div>
  );
}
