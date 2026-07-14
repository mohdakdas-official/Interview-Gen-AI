import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Trash2,
  BarChart3,
  Clock3,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import { deleteReport, getReports } from "../services/admin.api";
import { useAdmin } from "../hooks/useAdmin";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { baseUrl } from "../../baseURI/baseUrl";

export default function Reports() {
  const { admin } = useAdmin();

  const [allReports, setAllReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    try {
      const { data } = await getReports({
        page: 1,
        limit: 10,
        search,
      });

      setAllReports(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteReport = async (reportId) => {
    try {
      const { data } = await deleteReport(reportId);

      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };
  const confirmDelete = async () => {
    try {
      await deleteReport(selectedReport._id);

      // setAllReports((prev) => ({
      //   ...prev,
      //   reports: {
      //     ...prev.reports,
      //     reports: prev.reports.reports.filter(
      //       (report) => report._id !== selectedReport._id,
      //     ),
      //   },
      // }));

      fetchReports();
      setDeleteModal(false);
      setSelectedReport(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    );
  }
  if (!allReports) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-400">
        Failed to load Users.
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Interview Reports | InterviewGen AI</title>

        <meta
          name="description"
          content="Manage and review AI-generated interview reports from the Super Admin dashboard. View candidate reports, match scores, resume analysis, skill gaps, and interview insights."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, Interview Reports, AI Reports, Match Score, Resume Analysis, Admin Dashboard, Report Management"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href={`${baseUrl}/IGAI-admin/reports`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Interview Reports | InterviewGen AI"
        />
        <meta
          property="og:description"
          content="Manage AI-generated interview reports, review candidate insights, match scores, resume analysis, and skill gap reports."
        />
        <meta property="og:url" content={`${baseUrl}/IGAI-admin/reports`} />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Interview Reports | InterviewGen AI"
        />
        <meta
          name="twitter:description"
          content="Manage AI-generated interview reports, review candidate insights, match scores, resume analysis, and skill gap reports."
        />
        <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      </Helmet>
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <span>Reports</span>

            <RefreshCcw
              size={24}
              onClick={fetchReports}
              className={`cursor-pointer transition duration-300 ${
                loading
                  ? "animate-spin"
                  : "hover:rotate-180 hover:text-blue-500"
              }`}
            />
          </h1>
          <p className="mt-2 text-zinc-400">
            Manage all generated interview reports.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <FileText className="mb-4 text-blue-500" size={28} />
            <p className="text-zinc-400">Total Reports</p>
            <h2 className="mt-2 text-4xl font-bold">
              {allReports.reports.stats.totalReports}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <CheckCircle2 className="mb-4 text-green-500" size={28} />
            <p className="text-zinc-400">Completed</p>
            <h2 className="mt-2 text-4xl font-bold">
              {allReports.reports.stats.totalReports}
            </h2>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden">
            <Clock3 className="mb-4 text-yellow-500" size={28} />
            <p className="text-zinc-400">Pending</p>
            <h2 className="mt-2 text-4xl font-bold">311</h2>
            <div className="absolute top-0 left-0 w-full h-full p-6 bg-black">
              <h2 className="font-bold">Comming Soon</h2>
              <div className="w-full h-20 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 md:w-96">
            <Search size={18} className="text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search reports..."
              className="ml-3 w-full bg-transparent outline-none"
            />
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 hover:bg-zinc-800">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="min-w-full">
            <thead className="bg-zinc-950">
              <tr>
                <th className="p-5 text-left">Candidate</th>
                <th className="text-left">Role</th>
                <th className="text-center">Score</th>
                <th className="text-center">Status</th>
                <th className="text-center">Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allReports.reports.reports.map((report) => (
                <tr
                  key={report._id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40"
                >
                  <td className="p-5">{report.username}</td>

                  <td>{report.title}</td>

                  <td className="text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium
                    ${
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

                  <td className="text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm
                    ${
                      report.technicalQuestions &&
                      report.behaviouralQuestions &&
                      report.skillGaps &&
                      report.preparationDays
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                    >
                      {report.technicalQuestions &&
                      report.behaviouralQuestions &&
                      report.skillGaps &&
                      report.preparationDays
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </td>

                  <td className="text-center">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      <button className="cursor-pointer rounded-lg p-2 hover:bg-zinc-800">
                        <Eye size={18} />
                      </button>

                      <button className="cursor-pointer rounded-lg p-2 hover:bg-zinc-800">
                        <Download size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setDeleteModal(true);
                        }}
                        className="cursor-pointer rounded-lg p-2 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-[95%] max-w-md rounded-2xl border border-red-500/20 bg-zinc-900 p-6 shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                <Trash2 size={32} className="text-red-500" />
              </div>

              <h2 className="mt-5 text-center text-2xl font-bold">
                Delete Report
              </h2>

              <p className="mt-3 text-center text-zinc-400">
                Are you sure you want to delete
                <span className="font-semibold text-white">
                  {" "}
                  {selectedReport?.title}
                </span>
                ?
              </p>

              <p className="mt-2 text-center text-sm text-red-400">
                This interview report will be permanently deleted and cannot be
                recovered.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedReport(null);
                  }}
                  className="cursor-pointer flex-1 rounded-xl border border-zinc-700 py-3 font-medium transition hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="cursor-pointer flex-1 rounded-xl bg-red-600 py-3 font-medium transition hover:bg-red-700"
                >
                  Delete Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
