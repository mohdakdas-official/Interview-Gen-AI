import "../styles/admin.css";

import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="p-5 group rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-white">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
          <Icon size={24} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-green-400">
        <ArrowUpRight size={18} />

        <span className="text-sm font-medium">{change}</span>

        <span className="text-zinc-500 text-sm">vs last month</span>
      </div>
    </div>
  );
}
