import "../../../style.scss";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Activity,
  Clock,
  Map,
  User,
  ChevronLeft,
  MoveLeft,
  Download,
} from "lucide-react";
import "../style/Interview.scss";
import { useInterview } from "../hooks/useInterview";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const AccordionCard = ({ idx, item, isOpen, onToggle }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="card"
    >
      <div className="card-head" onClick={onToggle}>
        <div className="badge">{String(idx + 1).padStart(2, "0")}</div>
        <div className="title">{item.question}</div>
        <motion.div
          className="chev"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="card-body"
          >
            <div className="label purple">INTENTION</div>
            <div className="muted">{item.intention}</div>

            <div style={{ height: 8 }} />

            <div className="label green">MODEL ANSWER</div>
            <div className="muted">{item.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProgressRing = ({ value = 0 }) => {
  const radius = 44;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="progress-wrap">
      <svg height={radius * 2} width={radius * 2} className="progress-ring">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9cff8f" />
            <stop offset="100%" stopColor="#1effb6" />
          </linearGradient>
        </defs>
        <circle
          stroke="#0d1423"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="url(#g1)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9 }}
        />
      </svg>

      <div className="progress-inner">{value}%</div>
    </div>
  );
};

const severityColors = {
  low: "#4CAF50",
  medium: "#FFC107",
  high: "#F44336",
};

const Interview = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("technical");

  const { interviewId } = useParams();
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

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
    getReportById(interviewId);
  }, [interviewId]);

  const handleGetResumePdf = async () => {
    try {
      const response = await getResumePdf({
        interviewReportId: report?._id,
      });
      showToast(response.message, "success");
    } catch (error) {
      showToast(error.status(503).response?.data?.message, "Error");
    }
  };

  if (!report) {
    return (
      <div className="skeleton-page">
        <div className="skeleton-sidebar shimmer"></div>

        <div className="skeleton-content">
          <div className="skeleton-title shimmer"></div>

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-card shimmer"></div>
          ))}
        </div>

        <div className="skeleton-right">
          <div className="skeleton-circle shimmer"></div>
        </div>
      </div>
    );
  }

  const data = report;

  const questions =
    activeTab === "technical"
      ? data.technicalQuestions
      : data.behaviouralQuestions;

  return (
    <>
      <Helmet>
        <title>Interview Report | InterviewGen AI</title>

        <meta
          name="description"
          content="View your AI-generated interview report with match score, technical questions, behavioral questions, skill gap analysis, strengths, weaknesses, and a personalized preparation plan."
        />

        <meta
          name="keywords"
          content="Interview Report, AI Interview Report, Match Score, Resume Analysis, Skill Gap Analysis, Technical Questions, Behavioral Questions, Interview Preparation"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href="https://your-domain.com/interview/report" />
      </Helmet>
      <div className="dashboard-root">
        <div className="dashboard-wrap">
          <aside className="left-sb">
            <div>
              <div className="brand">AI Interview</div>

              <nav className="nav">
                <button
                  className={`nav-item ${activeTab === "technical" ? "active" : ""}`}
                  onClick={() => setActiveTab("technical")}
                >
                  <Activity size={16} />
                  <span>Technical Questions</span>
                </button>

                <button
                  className={`nav-item ${activeTab === "behavioural" ? "active" : ""}`}
                  onClick={() => setActiveTab("behavioural")}
                >
                  <User size={16} />
                  <span>Behavioral Questions</span>
                </button>

                <button
                  className={`nav-item ${activeTab === "roadmap" ? "active" : ""}`}
                  onClick={() => setActiveTab("roadmap")}
                >
                  <Map size={16} />
                  <span>Road Map</span>
                </button>
              </nav>
            </div>
            <div className="left-sb-footer">
              <button
                className="interview-buttons"
                disabled={loading}
                onClick={handleGetResumePdf}
              >
                <span className="interview-btn-content">
                  <span className="icon-slot">
                    {loading ? (
                      <span className="spinner"></span>
                    ) : (
                      <svg
                        height="0.8rem"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                      </svg>
                    )}
                  </span>

                  <span className="btn-text">
                    {loading ? "Generating Resume..." : "AI Generated Resume"}
                  </span>

                  <span className="icon-slot">
                    {loading ? (
                      <span style={{ visibility: "hidden" }}>
                        <Download size={16} />
                      </span>
                    ) : (
                      <Download size={16} />
                    )}
                  </span>
                </span>
              </button>

              <Link to={"/"} className="back-btn">
                <MoveLeft size={16} />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </aside>

          <main className="center">
            <div className="center-head">
              <h3>
                {activeTab === "technical"
                  ? "Technical Questions"
                  : activeTab === "behavioural"
                    ? "Behavioral Questions"
                    : "Road Map"}
              </h3>
              {activeTab !== "roadmap" && (
                <div className="count">{questions.length} questions</div>
              )}
            </div>

            <div className="cards">
              {activeTab !== "roadmap" &&
                questions.map((q, i) => (
                  <AccordionCard
                    key={i}
                    idx={i}
                    item={q}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                  />
                ))}

              {activeTab === "roadmap" && (
                <div className="roadmap-list">
                  {data.preparationPlan.map((item, index) => (
                    <div className="roadmap-card" key={index}>
                      <div className="roadmap-day">Day {item.day}</div>
                      <div className="roadmap-focus">{item.focus}</div>
                      <div className="roadmap-detail">
                        {item.tasks?.join(", ") ||
                          "Review the topic and practice related exercises."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          <aside className="right-sb">
            <div className="score-area">
              <div className="score-title">MATCH SCORE</div>
              <ProgressRing value={data.matchScore} />
              <div className="score-sub">Strong match for this role</div>
            </div>

            <div className="gap-area">
              <div className="gap-title">SKILL GAPS</div>
              <div className="gap-list">
                {data.skillGaps.map((s, i) => (
                  <div
                    className="gap-item"
                    key={i}
                    style={{
                      boxShadow: `0 6px 18px ${severityColors[s.severity]}33`,
                      borderColor: severityColors[s.severity],
                    }}
                  >
                    {s.skill}
                  </div>
                ))}
              </div>
            </div>
          </aside>
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

export default Interview;
