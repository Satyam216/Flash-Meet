"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation"; // Use next/navigation for routing
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";
import { auth } from "../lib/firebaseConfig";

export default function Sidebar() {
  const router = useRouter();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">FlashMeet</h2>
      <nav className="space-y-4">
        {/* Home Link */}
        <SidebarItem
          icon={<FaHome />}
          label="Home"
          onClick={() => router.push("/")} // Navigate to the home page
        />

        {/* Profile Link */}
        <SidebarItem
          icon={<FaUser />}
          label="Profile"
          onClick={() => router.push("/profile")} // Navigate to the profile page
        />

        {/* Meetings Link */}
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Meetings"
          onClick={() => router.push("/meetings")} // Navigate to the meetings page
        />

        {/* Settings Link */}
        <SidebarItem
          icon={<FaCog />}
          label="Settings"
          onClick={() => router.push("/settings")} // Navigate to the settings page
        />

        {/* Logout Button */}
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          onClick={handleLogout} // Handle logout
        />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-lg">{label}</span>
    </div>
  );
}