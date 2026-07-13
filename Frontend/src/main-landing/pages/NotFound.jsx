import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | InterviewGen AI</title>

        <meta
          name="description"
          content="The page you are looking for could not be found. Return to InterviewGen AI to continue generating AI-powered interview reports and career insights."
        />

        <meta
          name="keywords"
          content="404, Page Not Found, InterviewGen AI, Error Page"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link rel="canonical" href={`https:interviewgen-ai.vercel.app/404`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="404 - Page Not Found | InterviewGen AI"
        />
        <meta
          property="og:description"
          content="The page you are looking for could not be found."
        />
        <meta
          property="og:url"
          content={`https:interviewgen-ai.vercel.app/404`}
        />
        <meta
          property="og:image"
          content={`https:interviewgen-ai.vercel.app/og-image.png`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="404 - Page Not Found | InterviewGen AI"
        />
        <meta
          name="twitter:description"
          content="The page you are looking for could not be found."
        />
        <meta
          name="twitter:image"
          content={`https:interviewgen-ai.vercel.app/og-image.png`}
        />
      </Helmet>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6">
        {/* Background Glow */}
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF025E]/15 blur-[140px]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
              backgroundSize: "45px 45px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl text-center">
          {/* 404 */}
          <h1 className="text-[120px] font-extrabold leading-none text-transparent md:text-[220px]">
            <span className="bg-gradient-to-b from-[#FF4A8B] via-[#FF025E] to-[#8B0035] bg-clip-text drop-shadow-[0_0_35px_rgba(255,2,94,.6)]">
              404
            </span>
          </h1>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-5xl">
            Page Not Found
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-gray-400">
            Sorry, the page you are looking for doesn't exist, has been moved,
            or the URL is incorrect.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl bg-[#FF025E] px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#e00052]"
            >
              <Home size={20} />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 rounded-xl border border-[#FF025E]/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:border-[#FF025E] hover:bg-[#FF025E]/10"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Decorative */}
          <div className="mt-16 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#FF025E]/30 bg-[#FF025E]/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF025E]/20">
                <span className="text-3xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
