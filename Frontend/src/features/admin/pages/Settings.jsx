import { Helmet } from "react-helmet-async";

import { useEffect, useState } from "react";

import { getSettings } from "../services/admin.api";
import {
  User,
  Lock,
  Bell,
  Database,
  Palette,
  Bot,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function Settings() {
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
  const profile = settings.profile;

  const gemini = settings.gemini;

  const storage = settings.storage;

  const notifications = settings.notifications;

  const systemHealth = settings.systemHealth;
  return (
    <>
      <Helmet>
        <title>Settings | InterviewGen AI</title>

        <meta
          name="description"
          content="Manage Super Admin account settings, security, Gemini API configuration, notifications, storage usage, appearance preferences, and system health for InterviewGen AI."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, Admin Settings, Super Admin, Gemini API Settings, Security, Notifications, Storage, System Health, Dashboard"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href="https://your-domain.com/admin/settings" />
      </Helmet>
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-zinc-400">
            Manage your admin account and application settings.
          </p>
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <User className="text-blue-500" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 select-none">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="mb-2 text-sm text-zinc-500">Full Name</p>

              <div className="flex items-center gap-3">
                <User className="text-blue-500" size={20} />

                <span className="text-lg font-medium">{profile.name}</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="mb-2 text-sm text-zinc-500">Email</p>

              <div className="flex items-center gap-3">
                <Bot className="text-cyan-500" size={20} />

                <span className="text-lg font-medium">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Lock className="text-green-500" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="password"
              placeholder="New Password"
              disabled
              className="rounded-xl border border-zinc-800 bg-[#0F0F12] px-4 py-3 outline-none"
            />

            <input
              type="password"
              disabled
              placeholder="Confirm Password"
              className="rounded-xl border border-zinc-800 bg-[#0F0F12] px-4 py-3 outline-none"
            />
          </div>
        </div>

        {/* Gemini */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bot className="text-purple-500" />
            <h2 className="text-xl font-semibold">Gemini Configuration</h2>
          </div>

          <input
            placeholder="Gemini API Key"
            defaultValue={gemini.key}
            disabled
            className="w-full rounded-xl border border-zinc-800 bg-[#0F0F12] px-4 py-3 outline-none"
          />
        </div>

        {/* Theme */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Palette className="text-pink-500" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <select
            className="w-full rounded-xl border border-zinc-800 bg-[#0F0F12] px-4 py-3 outline-none"
            defaultValue="Dark"
            disabled
          >
            <option>Dark</option>
            <option>Light</option>
            <option>System</option>
          </select>
        </div>

        {/* Storage */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Database className="text-orange-500" />
            <h2 className="text-xl font-semibold">Storage</h2>
          </div>

          <div className="h-3 rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                storage.percentage < 50
                  ? "bg-green-500"
                  : storage.percentage < 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${storage.percentage}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              {storage.used} MB used of {storage.total} MB
            </span>

            <span
              className={`font-semibold ${
                storage.percentage < 50
                  ? "text-green-400"
                  : storage.percentage < 75
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {storage.percentage}%
            </span>
          </div>
        </div>

        {/* Notifications */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bell className="text-yellow-500" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Email Notifications</span>

              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                readOnly
                className="h-5 w-5 accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span>System Alerts</span>

              <input
                type="checkbox"
                checked={notifications.systemAlerts}
                readOnly
                className="h-5 w-5 accent-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Security Status */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="text-green-500" />
            <h2 className="text-xl font-semibold">System Status</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-400">
                {systemHealth.database ? "Connected" : "Disconneted"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Gemini API</span>
              <span className="text-green-400">
                {systemHealth.gemini ? "Healthy" : "Failed"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Authentication</span>
              <span className="text-green-400">
                {systemHealth.authentication ? "Secure" : "Insecure"}
              </span>
            </div>
          </div>
        </div>

        {/* Save */}

        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
