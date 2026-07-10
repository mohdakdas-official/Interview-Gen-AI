import "../../../style.scss";
import { useEffect, useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { getMe } from "../services/auth.api";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const { loading, handleLogin, authimg } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    emailMessage: "",
    passwordMessage: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formDisabled, setFormDisabled] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
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
    setFormDisabled(true);
    try {
      const response = await handleLogin({ email, password });
      showToast(response.message, "success");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error.response?.message);
      showToast(
        error.response?.data?.message || "Something went wrong",
        "Error",
      );
      setFormDisabled(false);
    }
  };

  useEffect(() => {
    if (!authimg?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === authimg.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [authimg]);

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
        <title>Login | InterviewGen AI</title>

        <meta
          name="description"
          content="Login to InterviewGen AI and generate AI-powered interview reports."
        />
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
              <h1 className="auth__title">Welcome Back!</h1>

              <p className="auth__subtitle">Please login to your account</p>

              <form className="auth__form" onSubmit={handleSubmit}>
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

                <button
                  className="auth__button"
                  type="submit"
                  disabled={loading || formDisabled}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="auth__footer">
                    Forgot your password?
                    <br />
                    <Link to={"/forgot-password"} className="auth__link">
                      Click Here
                    </Link>
                  </p>
                  <p className="auth__footer">
                    Don't have an account?
                    <br />
                    <Link to={"/register"} className="auth__link">
                      register
                    </Link>
                  </p>
                </div>
              </form>
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

export default Login;
