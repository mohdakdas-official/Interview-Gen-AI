import { useState } from "react";
import { LockKeyhole, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { adminLogin } from "../services/admin.api";
import Toast from "../components/Toast";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { baseUrl } from "../../baseURI/baseUrl";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formDisabled, setFormDisabled] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() && !form.password.trim()) {
      setToast({
        show: true,
        type: "error",
        message: "Email and Password is required",
      });

      return;
    }

    if (!form.email.trim()) {
      setToast({
        show: true,
        type: "error",
        message: "Email is required",
      });

      return;
    }

    if (!form.password.trim()) {
      setToast({
        show: true,
        type: "error",
        message: "Password is required",
      });

      return;
    }
    setFormDisabled(true);
    try {
      const { data } = await adminLogin(form);
      setToast({
        show: true,
        type: "success",
        message: "Login Successful",
      });

      setTimeout(() => {
        setToast({
          show: false,
          type: "",
          message: "",
        });
      }, 3000);

      setForm({ email: "", password: "" });

      setTimeout(() => {
        navigate("/IGAI-admin");
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Invalid Credentials",
      });

      setTimeout(() => {
        setToast({
          show: false,
          message: "",
          type: "",
        });
      }, 3000);
    } finally {
      setFormDisabled(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Super Admin Login | InterviewGen AI</title>

        <meta
          name="description"
          content="Secure Super Admin login for InterviewGen AI. Access the administration panel to manage users, interview reports, analytics, AI usage, subscriptions, and platform settings."
        />

        <meta
          name="keywords"
          content="InterviewGen AI Super Admin, Super Admin Login, Admin Panel, Dashboard, Secure Authentication"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href={`${baseUrl}/IGAI-admin/login`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Super Admin Login | InterviewGen AI"
        />
        <meta
          property="og:description"
          content="Secure Super Admin login for InterviewGen AI administration panel."
        />
        <meta property="og:url" content={`${baseUrl}/IGAI-admin/login`} />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Super Admin Login | InterviewGen AI"
        />
        <meta
          name="twitter:description"
          content="Secure Super Admin login for InterviewGen AI administration panel."
        />
        <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      </Helmet>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
        {/* Background Glow */}
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[150px]" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        {/* Login Card */}

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30">
            <LockKeyhole size={30} />
          </div>

          {/* Heading */}

          <h1 className="mt-6 text-center text-3xl font-bold">
            Interview Gen AI
          </h1>

          <p className="mt-2 text-center text-zinc-400">
            Administrator Control Panel
          </p>

          <p className="mt-1 text-center text-sm text-zinc-500">
            Secure access for authorized administrators only
          </p>

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 py-3 pl-12 pr-12 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember */}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400">
                <input type="checkbox" className="h-4 w-4 accent-blue-600" />
                Remember me
              </label>

              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>
            </div>

            {/* Button */}

            <button
              type="submit"
              disabled={formDisabled}
              className="
                      w-full
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      py-3
                      font-semibold
                      transition
                      duration-300
                      hover:scale-[1.02]
                      hover:shadow-lg
                      hover:shadow-blue-600/30
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      cursor-pointer
                      "
            >
              {formDisabled ? "Signing In..." : "Sign In Securely"}
            </button>
          </form>

          {/* Footer */}

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <ShieldCheck size={18} className="text-green-400" />

            <span>Protected by JWT Authentication</span>
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
      </div>
    </>
  );
}
