import "../../../style.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Helmet } from "react-helmet-async";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isAcceptTermsConditions, setIsAcceptTermsConditions] = useState(false);
  const [message, setMessage] = useState({
    usernameMessage: "",
    emailMessage: "",
    passwordMessage: "",
    isAcceptTermsConditions,
    otpMessage: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const { loading, handleRegister, handleVerifyOtp, authimg } = useAuth();
  const [pendingUser, setPendingUser] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      if (!username) {
        setMessage((prev) => ({
          ...prev,
          usernameMessage: "Username is required",
        }));
      }
      if (!email) {
        setMessage((prev) => ({
          ...prev,
          emailMessage: "Email is required",
        }));
      }
      if (!password) {
        setMessage((prev) => ({
          ...prev,
          passwordMessage: "Password is required",
        }));
      }

      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters long.");
    }
    if (!isAcceptTermsConditions) {
      showToast("Please accept the Terms & Conditions.", "error");
      return;
    }
    setFormDisabled(true);
    try {
      const response = await handleRegister({
        username,
        email,
        password,
        isAcceptTermsConditions,
      });

      setPendingUser({
        username,
        email,
        password,
        isAcceptTermsConditions,
      });
      showToast(response.message, "success");
      setShowOtpForm(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setFormDisabled(false);

      showToast(errorMessage, "Error");

      if (
        errorMessage ===
        "Account already registered with this email or username."
      ) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    }
  };
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage((prev) => ({
        ...prev,
        otpMessage: "OTP is required",
      }));
      return;
    }

    try {
      await handleVerifyOtp({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password,
        isAcceptTermsConditions: pendingUser.isAcceptTermsConditions,
        otp,
      });
      showToast(response.message, "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      showToast(error.response?.data?.message, "Error");
    }
  };

  useEffect(() => {
    if (!authimg?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === authimg.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [authimg]);

  // if (loading) {
  //   return (
  //     <main>
  //       <h1>Loading...</h1>
  //     </main>
  //   );
  // }
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
  return (
    <>
      <Helmet>
        <title>Create Account | InterviewGen AI</title>

        <meta
          name="description"
          content="Create your InterviewGen AI account to generate AI-powered interview reports, resume analysis, skill gap insights, and personalized preparation plans."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, Register, Sign Up, AI Interview, Resume Analysis, Interview Preparation"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://your-domain.com/register" />
      </Helmet>
      <div className="auth">
        {/* LEFT IMAGE */}

        <div className="auth__left">
          <img
            src={authimg[currentIndex]} // {img[currentIndex]}
            alt=""
            className="auth__image"
          />
        </div>

        <div className="auth__overlay"></div>

        {/* RIGHT SIDE */}

        <div className="auth__right">
          <div className="auth__content">
            <div className="auth__logo-wrapper">
              <img
                src="/assets/traskify_main_logo.png"
                alt="Traskify Logo"
                className="auth__logo"
              />
            </div>

            <div className="auth__card">
              <h1 className="auth__title">Create account</h1>

              <p className="auth__subtitle">Create your account</p>

              <form className="auth__form" onSubmit={handleSubmit}>
                <input
                  type="username"
                  placeholder="username"
                  className="auth__input"
                  value={username}
                  disabled={formDisabled}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setMessage((prev) => ({
                      ...prev,
                      usernameMessage: "",
                    }));
                  }}
                />
                {message.usernameMessage && (
                  <span className="auth__error">{message.usernameMessage}</span>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="auth__input"
                  value={email}
                  disabled={formDisabled}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage((prev) => ({
                      ...prev,
                      emailMessage: "",
                    }));
                  }}
                />
                {message.emailMessage && (
                  <span className="auth__error">{message.emailMessage}</span>
                )}

                <input
                  type="password"
                  placeholder="Password"
                  className="auth__input"
                  value={password}
                  disabled={formDisabled}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage((prev) => ({
                      ...prev,
                      passwordMessage: "",
                    }));
                  }}
                />
                {message.passwordMessage && (
                  <span className="auth__error">{message.passwordMessage}</span>
                )}
                <label className="flex items-start gap-3 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={isAcceptTermsConditions}
                    onChange={(e) =>
                      setIsAcceptTermsConditions(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
                  />

                  <span>
                    I agree to the{" "}
                    <Link
                      to="/terms-and-conditions"
                      className="text-blue-500 hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </label>

                <button
                  className="auth__button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <p className="auth__footer">
                  already have an account?
                  <Link to={"/login"} className="auth__link">
                    login
                  </Link>
                </p>
              </form>
              {showOtpForm && (
                <div className="verify-otp-cont">
                  <h1 className="auth__title verify-otp-title">Verify OTP</h1>
                  <form className="auth__form" onSubmit={handleVerify}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="auth__input"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setMessage((prev) => ({
                          ...prev,
                          otpMessage: "",
                        }));
                      }}
                    />
                    {message.otpMessage && (
                      <span className="auth__error">{message.otpMessage}</span>
                    )}

                    <button
                      className="auth__button"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "verify"}
                    </button>
                  </form>
                </div>
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
      </div>
    </>
  );
};

export default Register;
