import { useState } from "react";
import { Outlet } from "react-router";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-white pt-20">
      {/* Header */}
      <Header open={open} setOpen={setOpen} />

      {/* Body */}
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* <div className="hidden lg:block w-72" /> */}
        {/* Content */}
        <main
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-zinc-950
    [&::-webkit-scrollbar-thumb]:bg-zinc-700
    [&::-webkit-scrollbar-thumb]:rounded-full
    hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
