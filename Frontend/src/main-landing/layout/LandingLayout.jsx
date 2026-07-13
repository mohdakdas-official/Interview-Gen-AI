import { Link, Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { RiMenuFold2Line } from "@remixicon/react";

const LandingLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className="min-h-screen bg-[#030712] text-white overflow-x-hidden overflow-y-auto
      [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-zinc-950
    [&::-webkit-scrollbar-thumb]:bg-zinc-700
    [&::-webkit-scrollbar-thumb]:rounded-full
    hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
    >
      <Header setMenuOpen={setMenuOpen} />

      <main>
        <Outlet />
      </main>

      <Footer />
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-[#030c22] p-7 flex flex-col gap-10 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <RiMenuFold2Line
            size={28}
            className="cursor-pointer self-start"
            onClick={() => setMenuOpen(false)}
          />

          <nav className="flex flex-col gap-8 text-gray-300">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white"
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white"
            >
              How it Works
            </a>

            <a
              href="#faq"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white"
            >
              FAQ
            </a>
          </nav>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-[#FF025E] px-6 py-3 text-center font-semibold hover:scale-105 transition"
          >
            Launch Interview Gen AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingLayout;
