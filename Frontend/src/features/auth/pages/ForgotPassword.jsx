import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";

import { Mail, KeyRound, Lock } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
// import Toast from "../../admin/components/Toast";

import React from "react";

const ForgotPassword = () => {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const [pendingUser, setPendingUser] = useState({
    email: "",
  });
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    handleForgotPassword,
    handleVerifyForgotEmail,
    handleResetPassword,
    loading,
  } = useAuth();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const closeToast = () => {
    setToast({
      show: false,
      type: "",
      message: "",
    });
  };
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    try {
      const data = await handleForgotPassword({
        email: formData.email.trim().toLowerCase(),
      });
      setFormDisabled(true);

      showToast(data.message, "success");
      setPendingUser({
        email: formData.email.trim().toLowerCase(),
      });

      setStep(2);

      setTimer(60);

      setCanResend(false);
      setFormDisabled(false);
    } catch (error) {
      setFormDisabled(false);
      showToast(
        error.response?.data?.message || "Something went wrong",
        "Error",
      );
    }
  };
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  };

  useEffect(() => {
    if (step !== 2) return;

    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setFormDisabled(true);
      const data = await handleVerifyForgotEmail({
        email: pendingUser.email,
        otp: formData.otp,
      });

      showToast(data.message, "success");

      setStep(3);
      setFormDisabled(false);
    } catch (error) {
      setFormDisabled(false);
      showToast(
        error.response?.data?.message || "Something went wrong",
        "Error",
      );
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setToast({
        show: true,
        type: "error",
        message: "Passwords do not match",
      });
    }
    if (formData.password.length < 8) {
      return setToast({
        show: true,
        type: "error",
        message: "Password must be at least 8 characters long.",
      });
    }

    try {
      setFormDisabled(true);
      const data = await handleResetPassword({
        email: pendingUser.email,
        password: formData.password,
      });

      showToast(data.message, "success");
      setFormDisabled(false);

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 2000);
    } catch (error) {
      setFormDisabled(false);
      showToast(
        error.response?.data?.message || "Something went wrong",
        "Error",
      );
    }
  };
  return (
    <>
      <Helmet>
        <title>Forgot Password | InterviewGen AI</title>

        <meta
          name="description"
          content="Reset your InterviewGen AI account password securely using email verification."
        />

        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="min-h-screen bg-[#09090B] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Card */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-[0_0_60px_rgba(37,99,235,0.12)]">
            {" "}
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img
                src="/assets/traskify_main_logo.png"
                alt="InterviewGen AI"
                className="mx-auto h-20 w-auto"
              />
            </div>
            {/* Heading */}
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                  {" "}
                  {step === 1
                    ? "Forgot Password"
                    : step === 2
                      ? "Verify OTP"
                      : "Reset Password"}
                </h1>

                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  {" "}
                  {step === 1 &&
                    "Enter your registered email address to receive an OTP."}
                  {step === 2 &&
                    "Enter the verification code sent to your email."}
                  {step === 3 && "Create a strong password for your account."}
                </p>
              </div>
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="mt-10 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                      Email Address
                    </label>

                    <div className="group flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 transition focus-within:border-blue-500">
                      <Mail
                        size={20}
                        className="text-zinc-500 group-focus-within:text-blue-500 transition"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your registered email"
                        disabled={formDisabled}
                        className={`w-full px-4 py-4 outline-none transition
                                    ${
                                      formDisabled
                                        ? "cursor-not-allowed bg-transparent text-zinc-500 placeholder:text-zinc-600"
                                        : "bg-transparent text-white placeholder:text-zinc-500"
                                    }`}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-xl bg-blue-600 py-4 text-base font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>

                  <p className="text-center text-sm text-zinc-400">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              )}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="mt-10 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                      Registered Email
                    </label>

                    <div className="group flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 transition focus-within:border-blue-500">
                      <Mail
                        size={20}
                        className="text-zinc-500 group-focus-within:text-blue-500 transition"
                      />

                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className={`w-full px-4 py-4 outline-none transitioncursor-not-allowed bg-transparent text-zinc-500 placeholder:text-zinc-600`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                      Enter OTP
                    </label>

                    <div className="group flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 transition focus-within:border-blue-500">
                      <KeyRound className="text-zinc-500" size={20} />

                      <input
                        type="text"
                        name="otp"
                        autoFocus
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otp: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        disabled={formDisabled}
                        className={`w-full px-4 py-4 outline-none transition
                                    ${
                                      formDisabled
                                        ? "cursor-not-allowed bg-transparent text-zinc-500 placeholder:text-zinc-600"
                                        : "bg-transparent text-white placeholder:text-zinc-500"
                                    }`}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-xl bg-blue-600 py-4 text-base font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <div className="text-center">
                    <p className="mb-3 text-sm text-zinc-400">
                      Didn't receive the code?
                    </p>

                    <button
                      type="button"
                      disabled={!canResend}
                      onClick={handleSendOtp}
                      className={`font-medium cursor-pointer transition ${
                        canResend
                          ? "text-blue-500 hover:text-blue-400"
                          : "cursor-not-allowed text-zinc-500"
                      }`}
                    >
                      {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
                    </button>
                  </div>
                </form>
              )}
              {step === 3 && (
                <form onSubmit={handleReset} className="mt-10 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                      New Password
                    </label>

                    <div className="group flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 transition focus-within:border-blue-500">
                      <Lock className="text-zinc-500" size={20} />

                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        disabled={formDisabled}
                        className={`w-full px-4 py-4 outline-none transition
                                    ${
                                      formDisabled
                                        ? "cursor-not-allowed bg-transparent text-zinc-500 placeholder:text-zinc-600"
                                        : "bg-transparent text-white placeholder:text-zinc-500"
                                    }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                      Confirm Password
                    </label>

                    <div className="group flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 transition focus-within:border-blue-500">
                      <Lock className="text-zinc-500" size={20} />

                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        disabled={formDisabled}
                        className={`w-full px-4 py-4 outline-none transition
                                    ${
                                      formDisabled
                                        ? "cursor-not-allowed bg-transparent text-zinc-500 placeholder:text-zinc-600"
                                        : "bg-transparent text-white placeholder:text-zinc-500"
                                    }`}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-xl bg-blue-600 py-4 text-base font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {toast.show && (
          <div className={`toast ${toast.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === "success" ? "✅" : "❌"}
              </span>

              <div className="toast-text">
                <h4>{toast.type === "success" ? "Success" : "Error"}</h4>

                <p>{toast.message}</p>
              </div>
            </div>

            <div className="toast-progress"></div>
          </div>
        )}
      </section>
    </>
  );
};

export default ForgotPassword;
