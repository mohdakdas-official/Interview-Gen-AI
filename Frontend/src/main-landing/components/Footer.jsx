import { Sparkles } from "lucide-react";
import { RiGithubFill, RiLinkedinFill } from "@remixicon/react";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF025E] flex items-center justify-center">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="font-bold text-xl">Interview Gen AI</h2>

                <p className="text-gray-400 text-sm">AI Interview Assistant</p>
              </div>
            </div>

            <p className="mt-6 text-gray-400 leading-7 max-w-sm">
              A completely free AI-powered interview preparation platform that
              analyzes resumes, compares job descriptions, generates interview
              questions, and creates a personalized preparation roadmap.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5">Quick Links</h3>

            <div className="space-y-3">
              <a
                href="/#features"
                className="block text-gray-400 hover:text-white transition"
              >
                Features
              </a>

              <a
                href="/#workflow"
                className="block text-gray-400 hover:text-white transition"
              >
                How it Works
              </a>

              <a
                href="/#faq"
                className="block text-gray-400 hover:text-white transition"
              >
                FAQ
              </a>

              <NavLink
                to="/privacy-policy"
                className="block text-gray-400 hover:text-white transition"
              >
                Privacy Policy
              </NavLink>

              <NavLink
                to="/terms-of-service"
                className="block text-gray-400 hover:text-white transition"
              >
                Terms of Service
              </NavLink>

              <NavLink
                to="/help-center"
                className="block text-gray-400 hover:text-white transition"
              >
                Help Center
              </NavLink>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5">Connect</h3>

            <div className="flex flex-col gap-3">
              <NavLink
                to="https://github.com/mohdakdas-official"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-gray-400 hover:text-white"
              >
                <RiGithubFill size={20} />
                GitHub
              </NavLink>
              <NavLink
                to="https://www.linkedin.com/in/mohd-akdas/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-gray-400 hover:text-white"
              >
                <RiLinkedinFill size={20} />
                Linkedin
              </NavLink>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 text-center text-gray-500">
          © {new Date().getFullYear()} Interview Gen AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
