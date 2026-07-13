import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  HelpCircle,
  FileText,
  User,
  ShieldCheck,
  BrainCircuit,
  Mail,
} from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    question: "What is InterviewGen AI?",
    answer:
      "InterviewGen AI is a free AI-powered platform that analyzes your resume, job description, and profile to generate interview questions, match scores, skill gap analysis, strengths, weaknesses, and a personalized preparation plan.",
  },
  {
    question: "Is InterviewGen AI free to use?",
    answer: "Yes. InterviewGen AI is currently free for all users.",
  },
  {
    question: "How do I generate an interview report?",
    answer:
      "Sign in to your account, provide your resume, job description, and a short self-description, then click Generate Report. The AI will create a personalized interview report within a few moments.",
  },
  {
    question: "Can I view my previous reports?",
    answer:
      "Yes. All generated reports are available from your Dashboard after logging into your account.",
  },
  {
    question: "Can I delete my reports?",
    answer:
      "Yes. You can permanently delete any interview report from your dashboard.",
  },
  {
    question: "Is my resume secure?",
    answer:
      "Yes. We take reasonable security measures to protect your information and only use it to provide the requested AI interview analysis.",
  },
  {
    question: "The AI report looks incorrect. What should I do?",
    answer:
      "Review the information you entered. More accurate resumes and job descriptions generally produce better interview reports.",
  },
  {
    question: "I forgot my password.",
    answer:
      "Use the Forgot Password option on the login page to reset your password.",
  },
];

const HelpCenter = () => {
  return (
    <>
      <Helmet>
        <title>Help Center | InterviewGen AI</title>

        <meta
          name="description"
          content="Find answers to common questions about InterviewGen AI including account management, interview reports, privacy, troubleshooting, and support."
        />

        <meta name="robots" content="index,follow" />

        <link rel="canonical" href="https://your-domain.com/help-center" />
      </Helmet>

      <div className="min-h-screen bg-[#030712] text-white">
        {/* Hero */}

        <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-[#FF025E]/15 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-[#FF025E]" />
            </div>

            <h1 className="text-5xl font-bold mb-5">Help Center</h1>

            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Find answers to frequently asked questions about InterviewGen AI,
              account management, interview reports, privacy, and support.
            </p>
          </motion.div>
        </section>

        {/* Quick Help */}

        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <BrainCircuit className="text-[#FF025E] mb-4" size={34} />
            <Link to={"/dashboard"}>
              <h3 className="font-semibold text-xl mb-2">Generate Reports</h3>
            </Link>
            <p className="text-gray-400">
              Create AI-powered interview reports using your resume and job
              description.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <User className="text-[#FF025E] mb-4" size={34} />
            <Link to={"/dashboard"}>
              <h3 className="font-semibold text-xl mb-2">Manage Account</h3>
            </Link>
            <p className="text-gray-400">
              Update your profile, reset your password, and manage your saved
              reports.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <ShieldCheck className="text-[#FF025E] mb-4" size={34} />
            <Link to={"/privacy-policy"}>
              <h3 className="font-semibold text-xl mb-2">Privacy & Security</h3>
            </Link>
            <p className="text-gray-400">
              Learn how your information is protected and used by InterviewGen
              AI.
            </p>
          </div>
        </section>

        {/* FAQ */}

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <h3 className="font-semibold text-lg mb-3 text-white">
                  {faq.question}
                </h3>

                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Resources */}

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Helpful Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <FileText className="text-[#FF025E] mb-4" />
              <Link to={"/privacy-policy"}>
                <h3 className="font-semibold text-xl mb-2">Privacy Policy</h3>
              </Link>

              <p className="text-gray-400">
                Learn how we collect, use, and protect your information.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <ShieldCheck className="text-[#FF025E] mb-4" />
              <Link to={"/terms-of-service"}>
                <h3 className="font-semibold text-xl mb-2">Terms of Service</h3>
              </Link>

              <p className="text-gray-400">
                Read the rules and conditions for using InterviewGen AI.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex gap-5">
                <Mail className="text-[#FF025E] mb-4" />
                <Link to={"/terms-of-service"}>
                  <p className="font-semibold text-sm mb-2">
                    info.traskify@gmail.com
                  </p>
                </Link>
              </div>
              <h3 className="font-semibold text-xl mb-2">Contact Support</h3>

              <p className="text-gray-400">
                Need additional help? Reach out through our Business Email.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HelpCenter;
