import "../styles/admin.css";
import { NavLink } from "react-router";
import { Eye, Download, Trash2 } from "lucide-react";

export default function RecentReports({ reports }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Reports</h2>

          <p className="mt-1 text-sm text-zinc-400">
            Latest AI generated interview reports
          </p>
        </div>

        <NavLink
          to={"/admin/reports"}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
        >
          View All
        </NavLink>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto [&::-webkit-scrollbar]:h-2
    [&::-webkit-scrollbar-track]:bg-[#121214]
    [&::-webkit-scrollbar-thumb]:bg-zinc-700
    [&::-webkit-scrollbar-thumb]:rounded-full
    hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
      >
        <table className="min-w-full table-fixed ">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
              <th className="pb-4 font-medium w-[220px]">Candidate</th>

              <th className="pb-4 font-medium w-[250px]">Job Role</th>

              <th className="pb-4 text-center font-medium w-[120px]">
                Match Score
              </th>

              <th className="pb-4 text-center font-medium w-[180px]">
                Generated
              </th>

              <th className="pb-4 text-center font-medium w-[120px]">Status</th>

              <th className="pb-4 text-center font-medium w-[150px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report._id}
                className="border-b border-zinc-800 transition hover:bg-zinc-800/40"
              >
                {/* Candidate */}

                <td className="py-5 pr-4">
                  <div className=" overflow-hidden">
                    <h3 className=" truncate font-medium text-white w-35">
                      {report.user.username}
                    </h3>

                    <p
                      title={report.user.email}
                      className="truncate text-sm text-zinc-400 w-40"
                    >
                      {report.user.email}
                    </p>
                  </div>
                </td>

                {/* Job Role */}

                <td className="py-5 pr-4">
                  <div
                    title={report.title}
                    className="w-48 truncate overflow-hidden whitespace-nowrap text-zinc-300"
                  >
                    {report.title}
                  </div>
                </td>

                {/* Match Score */}

                <td className="text-center py-5 px-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      report.matchScore >= 85
                        ? "bg-green-500/20 text-green-400"
                        : report.matchScore >= 70
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {report.matchScore}%
                  </span>
                </td>

                {/* Generated */}

                <td className="text-center text-sm text-zinc-400 py-5 px-4 w-20 truncate">
                  {new Date(report.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Status */}

                <td className="text-center py-5 px-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      report.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {"Completed"}
                  </span>
                </td>

                {/* Actions */}

                <td>
                  <div className="flex justify-center gap-2 py-5 px-4">
                    <button className="rounded-lg bg-blue-600 p-2 transition hover:bg-blue-700">
                      <Eye size={16} />
                    </button>

                    <button className="rounded-lg bg-emerald-600 p-2 transition hover:bg-emerald-700">
                      <Download size={16} />
                    </button>

                    <button className="rounded-lg bg-red-600 p-2 transition hover:bg-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
