// Home.jsx
// NOTE:
// This is a starter scaffold for the premium landing page.
// It is intentionally structured as a single-file component.
//
// Sections included:
// - Helmet SEO
// - Hero
// - Features
// - How It Works
// - AI Report Preview
// - FAQ
// - CTA
//
// Replace placeholder arrays/content as needed.

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  FileText,
  Bot,
  Target,
  ClipboardCheck,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router";
import { baseUrl } from "../../features/baseURI/baseUrl";

const features = [
  {
    icon: BrainCircuit,
    title: "Resume Analysis",
    desc: "AI understands your resume.",
  },
  {
    icon: Target,
    title: "Job Match Score",
    desc: "Compare with any job description.",
  },
  {
    icon: Bot,
    title: "Interview Questions",
    desc: "Technical & HR questions.",
  },
  { icon: ShieldCheck, title: "Skill Gap", desc: "Identify missing skills." },
  {
    icon: ClipboardCheck,
    title: "Preparation Roadmap",
    desc: "Personalized learning plan.",
  },
  { icon: BadgeCheck, title: "100% Free", desc: "No subscription required." },
];

const faqs = [
  ["Is it free?", "Yes, completely free."],
  ["Need a subscription?", "No."],
  ["Need a credit card?", "No."],
  ["Can I analyze multiple jobs?", "Yes."],
];

export default function Home() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <Helmet>
        <title>Interview Gen AI | Free AI Interview Preparation Platform</title>

        <meta
          name="description"
          content="Generate AI interview reports, analyze your resume, compare job descriptions, identify skill gaps, and prepare smarter with Interview Gen AI. Completely free."
        />

        <meta
          name="keywords"
          content="Interview Gen AI, AI Interview, Resume Analyzer, Job Match Score, AI Interview Questions, Resume Analysis"
        />

        <meta name="author" content="Mohd Akdas Ansari" />

        <meta property="og:title" content="Interview Gen AI" />

        <meta
          property="og:description"
          content="Free AI-powered interview preparation platform."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content={`${baseUrl}/og-image.png`} />

        <meta property="og:url" content={baseUrl} />

        <meta name="twitter:card" content="summary_large_image" />

        <meta name="theme-color" content="#030712" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "InterviewGen AI",
            url: baseUrl,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Generate AI-powered interview reports with resume analysis, skill gap insights, technical and behavioral questions, and personalized preparation plans.",
          })}
        </script>
      </Helmet>

      <div className="fixed inset-0 -z-10 bg-[#030712] overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#FF025E]/20 blur-[180px] left-1/2 -translate-x-1/2 top-0" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[180px] right-0 bottom-0" />
      </div>

      <section className="min-h-screen flex items-center lg:pt-1 pt-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex gap-2 px-4 py-2 rounded-full border border-[#FF025E]/30 bg-[#FF025E]/10 text-pink-300">
              <Sparkles size={16} />
              100% Free
            </span>
            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight">
              Ace Your{" "}
              <span className="block text-[#FF025E]">Next Interview</span> with
              AI
            </h1>
            <p className="mt-8 text-gray-300 text-lg leading-8">
              Analyze your resume, compare it with job descriptions, generate
              interview questions and get a personalized roadmap.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/login"
                className="bg-[#FF025E] rounded-full px-8 py-4 flex items-center gap-2 font-semibold"
              >
                Launch Interview Gen AI <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="border border-white/20 rounded-full px-8 py-4"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex justify-between">
                <h2 className="font-bold text-xl">AI Report Preview</h2>
                <span className="text-green-400">Ready</span>
              </div>
              <div className="mt-8 space-y-5">
                <div>
                  <div className="flex justify-between">
                    <span>Match Score</span>
                    <span className="text-[#FF025E]">92%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full mt-2">
                    <div className="h-2 rounded-full bg-[#FF025E] w-[92%]" />
                  </div>
                </div>
                {[
                  "Technical Questions",
                  "Behaviour Questions",
                  "Skill Gap",
                  "Preparation Roadmap",
                ].map((x) => (
                  <div key={x} className="p-4 rounded-xl bg-black/30">
                    {x}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">What You Can Do</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <Icon className="text-[#FF025E]" />
                <h3 className="mt-5 text-2xl font-semibold">{f.title}</h3>
                <p className="text-gray-400 mt-3">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-6" id="workflow">
        <h2 className="text-4xl font-bold text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-14">
          {[
            "Upload Resume",
            "Paste Job Description",
            "Tell About Yourself",
            "Generate Report",
          ].map((s, i) => (
            <div
              key={s}
              className="rounded-3xl bg-white/5 border border-white/10 p-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#FF025E] mx-auto flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <p className="mt-5">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-4xl mx-auto px-6" id="faq">
        <h2 className="text-4xl font-bold text-center">FAQ</h2>
        <div className="space-y-4 mt-10">
          {faqs.map(([q, a], i) => (
            <div
              key={q}
              className=" border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className=" cursor-pointer w-full flex justify-between p-5"
              >
                {q}
                <ChevronDown
                  className={
                    open === i ? "rotate-180 transition" : "transition"
                  }
                />
              </button>
              {open === i && <div className="p-5 pt-0 text-gray-400">{a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[40px] bg-gradient-to-r from-[#FF025E] to-violet-600 p-14 text-center">
          <h2 className="text-5xl font-bold">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="mt-5 text-white/80">
            Generate your AI report in seconds.
          </p>
          <Link
            to="/login"
            className="inline-flex mt-10 bg-white text-black px-8 py-4 rounded-full font-semibold"
          >
            Launch Interview Gen AI
          </Link>
        </div>
      </section>
    </>
  );
}
