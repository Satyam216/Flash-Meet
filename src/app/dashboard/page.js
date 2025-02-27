"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome, {user?.displayName || user?.email}!</h1>
      <p className="text-gray-400 mt-2">Here's what's happening today:</p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <DashboardCard title="Upcoming Meetings" count={3} />
        <DashboardCard title="Connections Made" count={12} />
        <DashboardCard title="Messages Sent" count={58} />
      </div>
    </>
  );
}

function DashboardCard({ title, count }) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-4xl font-bold text-blue-400 mt-2">{count}</p>
    </div>
  );
}