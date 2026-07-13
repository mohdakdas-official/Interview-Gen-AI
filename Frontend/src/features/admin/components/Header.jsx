import {
  Bell,
  CalendarDays,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useAdmin } from "../hooks/useAdmin";
import { adminLogout } from "../services/admin.api";
import { useState } from "react";
import Toast from "./Toast";

export default function Header({ open, setOpen }) {
  const { admin } = useAdmin();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const handleAdminLogout = async () => {
    try {
      const response = await adminLogout();
      setToast({
        show: true,
        type: "success",
        message: "Logout Successful",
      });
      setTimeout(() => {
        setToast({
          show: false,
          type: "",
          message: "",
        });
      }, 3000);

      navigate("/IGAI-admin/login");
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <header className="fixed top-0 z-50 h-20 border-b border-zinc-800 bg-zinc-950 w-full">
      <div className="mx-auto flex h-full items-center justify-between px-5 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition hover:bg-zinc-800 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <CalendarDays size={15} />
              <span>{today}</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 w-72">
            <Search size={18} className="text-zinc-500" />

            <input
              type="text"
              placeholder="Search..."
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </div>

          {/* Notification */}
          <div className="relative group">
            <button className="cursor-pointer relative flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition hover:bg-zinc-800">
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
            {/* Dropdown */}
            <div className="invisible absolute right-0 top-[110%] z-50 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <NavLink
                to="/IGAI-admin/reports"
                className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <FileText size={18} />
                <span>New Reports Available</span>
              </NavLink>

              <NavLink
                to="/IGAI-admin/settings"
                className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Settings size={18} />
                <span>Settings Changed</span>
              </NavLink>
            </div>
          </div>
          {/* Profile */}
          <div className="relative group ">
            <button className="cursor-pointer flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800">
              <img
                src="/assets/admin-images/admin.jpg"
                alt="Admin"
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-white">{admin.name}</p>

                <p className="text-xs text-zinc-400">{admin.role}</p>
              </div>

              <ChevronDown
                size={18}
                className="text-zinc-500 transition group-hover:rotate-180"
              />
            </button>

            {/* Dropdown */}
            <div className="invisible absolute right-0 top-[110%] z-50 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <NavLink
                to="/IGAI-admin/settings"
                className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>

              <button
                onClick={handleAdminLogout}
                className=" cursor-pointer mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast({
            show: false,
            message: "",
            type: "",
          })
        }
      />
    </header>
  );
}
