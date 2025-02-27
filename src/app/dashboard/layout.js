"use client"; // Mark this as a Client Component

import Sidebar from "../components/sidebar"; // Import the Sidebar component

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}