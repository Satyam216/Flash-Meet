"use client";

import { useEffect, useState } from "react";
import { auth } from "./lib/firebaseConfig"; // Correct the path based on your structure
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/dashboard"); // Redirect to dashboard if user is logged in
      } else {
        router.push("/login"); // Redirect to login if user is not logged in
      }
    });

    socket.on("connect", () => console.log("Connected to WebSocket"));

    return () => {
      unsubscribe(); // Cleanup auth listener
      socket.disconnect(); // Cleanup WebSocket on unmount
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">Loading...</h1>
    </div>
  );
}
