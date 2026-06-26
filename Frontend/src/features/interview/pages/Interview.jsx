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
} from "lucide-react";
import "../style/Interview.scss";
import { useInterview } from "../hooks/useInterview";
import { Link, useParams } from "react-router";
import { useEffect } from "react";

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
  const { report, getReportById } = useInterview();

  useEffect(() => {
    getReportById(interviewId);
  }, [interviewId]);

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
          <div>
            <Link to={"/"} className="back-btn">
              <MoveLeft size={16} />
              <p>Go to Dashboard</p>
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
    </div>
  );
};

export default Interview;
