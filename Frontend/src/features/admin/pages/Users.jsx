import {
  Search,
  Filter,
  UserCheck,
  Users as UsersIcon,
  ShieldCheck,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { deleteUser, getUsers } from "../services/admin.api";
import { useAdmin } from "../hooks/useAdmin";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function Users() {
  const { admin } = useAdmin();
  const [filter, setFilter] = useState("all");
  const [allUsers, setAllUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { data } = await getUsers({
        page: 1,
        limit: 10,
        search,
        filter,
      });

      setAllUsers(data.Users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser._id);

      setDeleteModal(false);
      setSelectedUser(null);

      await fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, filter]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    );
  }
  if (!allUsers) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-400">
        Failed to load users.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management | InterviewGen AI</title>

        <meta
          name="description"
          content="Manage registered users in the InterviewGen AI Super Admin dashboard. View user details, verification status, account activity, and control user access."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, User Management, Admin Users, Manage Users, Admin Dashboard"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link
          rel="canonical"
          href="https://interviewgen-ai.vercel.app/IGAI-admin/users"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="User Management | InterviewGen AI" />
        <meta
          property="og:description"
          content="Manage registered users, verification status, account activity, and access controls from the Super Admin dashboard."
        />
        <meta
          property="og:url"
          content="https://interviewgen-ai.vercel.app/IGAI-admin/users"
        />
        <meta
          property="og:image"
          content="https://interviewgen-ai.vercel.app/og-image.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="User Management | InterviewGen AI"
        />
        <meta
          name="twitter:description"
          content="Manage registered users, verification status, account activity, and access controls from the Super Admin dashboard."
        />
        <meta
          name="twitter:image"
          content="https://interviewgen-ai.vercel.app/og-image.png"
        />
      </Helmet>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-zinc-400 mt-2">Manage all registered users.</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <UsersIcon className="text-blue-500 mb-4" size={28} />

            <h3 className="text-zinc-400">Total Users</h3>

            <p className="text-4xl font-bold mt-2">{allUsers.users.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <UserCheck className="text-green-500 mb-4" size={28} />

            <h3 className="text-zinc-400">Active Users</h3>

            <p className="text-4xl font-bold mt-2">
              {allUsers.stats.activeUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <ShieldCheck className="text-purple-500 mb-4" size={28} />

            <h3 className="text-zinc-400">Verified Users</h3>

            <p className="text-4xl font-bold mt-2">
              {allUsers.stats.verifiedUsers}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 w-full md:w-96">
            <Search size={18} className="text-zinc-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="ml-3 w-full bg-transparent outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="acceptedTerms">Accepted Terms</option>
            <option value="notAcceptedTerms">Not Accepted Terms</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full">
            <thead className="bg-zinc-950">
              <tr className="text-left">
                <th className="p-5">User</th>
                <th>Email</th>
                <th>Terms & Conditions</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allUsers.users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      {/* <img src={user.avatar} className="h-12 w-12 rounded-full" /> */}

                      <span>{user.username}</span>
                    </div>
                  </td>

                  <td>{user.email}</td>
                  <td className="font-semibold px-2 py-5">
                    <span
                      className={
                        user.isAcceptTermsConditions
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {user.isAcceptTermsConditions
                        ? "Accepted"
                        : "Not Accepted"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        user.isVerified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.isVerified ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      <button className="cursor-pointer rounded-lg p-2 hover:bg-zinc-700">
                        <Eye size={18} />
                      </button>

                      <button className="cursor-pointer rounded-lg p-2 hover:bg-zinc-700">
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
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
                Delete User
              </h2>

              <p className="mt-3 text-center text-zinc-400">
                Are you sure you want to delete
                <span className="font-semibold text-white">
                  {" "}
                  {selectedUser?.username}
                </span>
                ?
              </p>

              <p className="mt-2 text-center text-sm text-red-400">
                This action is permanent and will also delete all interview
                reports associated with this user.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 rounded-xl border border-zinc-700 py-3 font-medium transition hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-600 py-3 font-medium transition hover:bg-red-700 cursor-pointer"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
