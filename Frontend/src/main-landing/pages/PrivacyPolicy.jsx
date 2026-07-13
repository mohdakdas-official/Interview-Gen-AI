import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | InterviewGen AI</title>

        <meta
          name="description"
          content="Read the Privacy Policy of InterviewGen AI to understand how we collect, use, protect, and manage your personal information."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://interviewgen-ai.vercel.app/privacy-policy"
        />
      </Helmet>

      <div className="min-h-screen bg-[#030712] text-gray-300">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Privacy Policy
          </motion.h1>

          <p className="text-gray-400 mb-12">Last Updated: July 13, 2026</p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Introduction
              </h2>

              <p>
                Welcome to InterviewGen AI. Your privacy is important to us.
                This Privacy Policy explains how we collect, use, store, and
                protect your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Information We Collect
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Name and email address when creating an account.</li>
                <li>Password (securely encrypted).</li>
                <li>Job descriptions you provide.</li>
                <li>Resume text or uploaded resume content.</li>
                <li>Self-description and interview preferences.</li>
                <li>AI-generated interview reports.</li>
                <li>Basic usage analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. How We Use Your Information
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Generate AI-powered interview reports.</li>
                <li>Save your previous reports.</li>
                <li>Improve platform performance and user experience.</li>
                <li>Provide customer support.</li>
                <li>Detect misuse or fraudulent activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. AI Processing
              </h2>

              <p>
                Information such as your resume, job description, and profile
                details may be processed by AI models to generate personalized
                interview reports. This data is only used for providing the
                requested service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Data Storage
              </h2>

              <p>
                Your interview reports and account information are securely
                stored in our database. We implement reasonable security
                measures to protect your data against unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. Cookies
              </h2>

              <p>
                We may use cookies or similar technologies to improve user
                experience, remember preferences, and analyze website traffic.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Third-Party Services
              </h2>

              <p>
                We may use trusted third-party services such as AI providers,
                analytics tools, authentication services, or advertising
                platforms in the future. These services operate under their own
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Data Security
              </h2>

              <p>
                We use industry-standard security practices to protect your
                information. However, no internet transmission or electronic
                storage method can be guaranteed to be completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Your Rights
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Access your stored information.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Delete your account and associated data.</li>
                <li>Contact us regarding privacy concerns.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Children's Privacy
              </h2>

              <p>
                InterviewGen AI is not intended for children under the age of
                13. We do not knowingly collect personal information from
                children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                11. Changes to This Policy
              </h2>

              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page along with the updated revision
                date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                12. Contact Us
              </h2>

              <p>
                If you have any questions regarding this Privacy Policy, please
                contact us through the help center available on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
