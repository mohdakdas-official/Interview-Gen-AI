import "../styles/admin.css";

// const users = [
//   {
//     id: 1,
//     name: "Charlie",
//     email: "charlie@gmail.com",
//     joined: "Today",
//     reports: 5,
//   },
//   {
//     id: 2,
//     name: "Alex",
//     email: "alex@gmail.com",
//     joined: "Yesterday",
//     reports: 2,
//   },
//   {
//     id: 3,
//     name: "Emma",
//     email: "emma@gmail.com",
//     joined: "2 Days Ago",
//     reports: 7,
//   },
// ];

export default function RecentUsers({ users }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Users</h2>

        <button className="text-blue-400 hover:text-blue-300 text-sm">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.user._id}
            className="flex items-center justify-between rounded-xl bg-zinc-800/40 p-4 hover:bg-zinc-800 transition"
          >
            <div>
              <h3 className="font-semibold">{user.user.username}</h3>

              <p className="text-sm text-zinc-400">{user.user.email}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-500">
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <p className="font-semibold text-blue-400">
                {user.reportsCount}{" "}
                {user.reportsCount === 1 ? "Report" : "Reports"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
