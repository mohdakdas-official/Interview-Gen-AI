import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import { RiMenu3Line } from "@remixicon/react";
import { useState } from "react";

const Header = ({ setMenuOpen }) => {
  return (
    <motion.header
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#030712]/70"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FF025E] flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-bold text-xl">Interview Gen AI</h2>

            <p className="text-xs text-gray-400">AI Interview Assistant</p>
          </div>
        </Link>

        <nav className="hidden lg:flex gap-10 text-gray-300">
          <a href="#features" className="hover:text-white">
            Features
          </a>

          <a href="#workflow" className="hover:text-white">
            How it Works
          </a>

          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>

        <Link
          to="/login"
          className="hidden lg:flex rounded-full bg-[#FF025E] px-6 py-3 font-semibold hover:scale-105 duration-300"
        >
          Launch Interview Gen AI
        </Link>
        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex lg:hidden cursor-pointer"
        >
          <RiMenu3Line size={24} />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
