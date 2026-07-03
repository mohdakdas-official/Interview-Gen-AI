import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { Link } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { Power, Trash2 } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
  const { loading, generateReport, reports, getReports, deleteReport } =
    useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const resumeInputRef = useRef();
  const navigate = useNavigate();
  const { handleLogout, user } = useAuth();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    if (!selfDescription || !jobDescription) {
      alert(
        "Please fill both self description and job description for better result",
      );
      return;
    }

    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (data?._id) {
      navigate(`/interview/${data._id}`);
    }
  };
  const handleDeleteReport = async (interviewReportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const response = await deleteReport(interviewReportId);

      showToast(response.message, "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete report",
        "error",
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
    getReports();
  }, []);

  return (
    <section className="interview-plan">
      <div className="container">
        <div className="leftSB">
          <div className="profile-tile">
            <Link to="/">
              <img src="/assets/traskify_logo.png" alt="Traskify logo" />
            </Link>
            <div className="profile-info">
              <span className="welcome-username">
                <span className="welcome">Welcome, </span>
                <strong>{user?.username}</strong>
              </span>
              <Power
                className="logout-btn"
                size={20}
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              />{" "}
            </div>
          </div>
          <div className="recent-reports">
            <div className="recent-reports-header">
              <h2>My Recent Interview Plans</h2>
              <p>Reports older than 7 days will be automatically deleted.</p>
            </div>

            {!reports || reports.length === 0 ? (
              <p>No interview plans found.</p>
            ) : (
              <ul className="report-list">
                {reports.map((report) => (
                  <li
                    key={report._id}
                    className="report-item"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <h3>{report.title || "Untitled Position"}</h3>

                    <p className="report-meta">
                      <span>
                        Generated on{" "}
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report._id);
                        }}
                        className="delete-report-btn"
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 2,
                          color: "inherit",
                          hover: { color: "red" },
                        }}
                      >
                        <Trash2
                          size={"18px"}
                          style={{
                            cursor: "pointer",
                            borderRadius: "20px",
                            hover: { color: "red" },
                          }}
                        />
                      </button>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="report-create-form">
          <div className="plan-card-upper-header">
            <h1 className="plan-card-upper-header-title">
              Create Your Custom <span>Interview Plan</span>
            </h1>

            <p className="plan-card-upper-header-subtitle">
              Let our AI analyze the job requirements and your unique profile to
              build a winning strategy.
            </p>
          </div>

          <div className="plancard-with-bottom-bar">
            <div className="plan-card">
              {/* Left Side */}
              <div className="job-section">
                <div className="section-title">
                  <div>
                    🎁 <span>Target Job Description</span>
                  </div>

                  <span className="required">REQUIRED</span>
                </div>

                <textarea
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                  }}
                  placeholder="Paste the full job description here...

e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                />

                <div className="character-count">
                  {jobDescription.length} / 5000 chars
                </div>
              </div>

              {/* Right Side */}
              <div className="profile-section">
                <div className="section-title">
                  👤 <span>Your Profile</span>
                </div>

                <div className="upload-header">
                  Upload Resume
                  <span className="best-result">BEST RESULTS</span>
                </div>

                <label className="upload-box">
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0]);
                    }}
                  />

                  <div className="upload-icon">⤴</div>

                  <h4>Click to upload or drag & drop</h4>

                  <p>Only PDF is allowed (Max 5MB)</p>
                </label>

                {selectedFile && (
                  <div className="file-info">
                    <p>📄 {selectedFile.name}</p>
                    <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
                {selectedFile ? (
                  <div className="upload-success">✅ Resume Uploaded</div>
                ) : (
                  <div className="upload-pending">No file selected</div>
                )}

                <div className="divider">
                  <span className="divider-text">
                    <hr />
                    OR
                    <hr />
                  </span>
                </div>

                <h4 className="description-title">Quick Self-Description</h4>

                <textarea
                  onChange={(e) => {
                    setSelfDescription(e.target.value);
                  }}
                  className="small-textarea"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />

                <div className="info-box">
                  ℹ Providing both your <strong>Resume</strong> and
                  <strong> Self Description</strong> helps our AI create a more
                  accurate and personalized interview strategy.
                </div>
              </div>
            </div>

            <div className="bottom-bar">
              <span>AI-Powered Strategy Generation • Approx 30s</span>

              <button
                onClick={handleGenerateReport}
                disabled={loading}
                id="generate-report-btn"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating Report...
                  </>
                ) : (
                  "★ Generate My Interview Strategy"
                )}
              </button>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-links-right">
              <a href="/">Privacy Policy</a>
              <a href="/">Terms of Service</a>
              <a href="/">Help Center</a>
            </div>
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
      {loading && (
        <div className="loading-overlay">
          <div className="loader-card">
            <div className="spinner"></div>

            <h2>Generating Your Interview Strategy</h2>

            <p>
              Our AI is analyzing your resume, job description and experience to
              create a personalized interview plan.
            </p>

            <div className="loading-steps">
              <div>📄 Reading Resume</div>
              <div>💼 Matching Job Requirements</div>
              <div>🧠 Finding Skill Gaps</div>
              <div>🎯 Preparing Interview Strategy</div>
            </div>

            <div className="loading-progress">
              <div className="loading-progress-bar"></div>
            </div>

            <span className="loading-note">
              This usually takes around <strong>20–30 seconds</strong>.
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
