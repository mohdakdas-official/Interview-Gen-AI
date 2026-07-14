import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Bot,
  CreditCard,
  Settings,
  X,
  HardDrive,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getSettings } from "../services/admin.api";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/IGAI-admin",
  },
  {
    title: "Users",
    icon: Users,
    path: "/IGAI-admin/users",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/IGAI-admin/reports",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/IGAI-admin/analytics",
  },
  {
    title: "AI Usage",
    icon: Bot,
    path: "/IGAI-admin/ai-usage",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    path: "/IGAI-admin/subscription",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/IGAI-admin/settings",
  },
];

export default function Sidebar({ open, setOpen }) {
  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const fetchSettings = async () => {
    try {
      const { data } = await getSettings();

      setSettings(data.settings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    );
  }

  const storage = settings.storage;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          top-20
          left-0
          z-50
          h-[calc(100vh-80px)]
          w-72
          bg-zinc-950
          border-r
          border-zinc-800
          flex
          flex-col
          transition-transform
          duration-300

          ${open ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          lg:static
          lg:h-full
          lg:flex-shrink-0
        `}
      >
        {/* Logo */}
        <div className="border-b border-zinc-800 px-6 py-6">
          <div className="flex items-center gap-4 min-w-0">
            {" "}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#FF025E]">
              {" "}
              <Sparkles size={20} />
            </div>
            <div className="min-w-0 flex-1">
              {" "}
              <h2 className="truncate text-2xl font-bold text-white">
                InterviewGen AI
              </h2>{" "}
              <p className="mt-1 truncate text-sm text-zinc-500">
                Admin Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 rounded-lg p-2 hover:bg-zinc-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-zinc-800 p-5">
          <div className="rounded-2xl bg-zinc-900 p-5">
            <div className="mb-4 flex items-center gap-3">
              <HardDrive size={20} className="text-blue-500" />

              <span className="font-semibold">Storage</span>
            </div>

            <h3 className="text-xl font-bold">{storage.used} MB</h3>

            <p className="mt-1 text-sm text-zinc-500">
              of {storage.total} MB used
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-700">
              <div className="h-full w-[8%] rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
