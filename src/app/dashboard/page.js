"use client";

import { useState, useEffect } from "react";
import { auth, logout } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user ? (
        <>
          <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full my-4" />
          <p>Welcome, {user.displayName}!</p>
          <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 rounded">
            Log Out
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
