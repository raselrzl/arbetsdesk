"use client";

import { useState } from "react";
import AdminTopbar from "./AdminTopbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; name: string; email: string; role: string };
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile topbar (fixed) */}
      <AdminTopbar
        user={user}
        onHamburgerClick={() => setSidebarOpen(true)}
      />

      {/* Sidebar (fixed on desktop & mobile drawer) */}
      <AdminSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main
        className="
          min-h-screen
          md:h-screen
          overflow-y-auto
          pt-14 
          md:pt-0
          lg:ml-54
          
          
        "
      >
        {children}
      </main>
    </div>
  );
}
