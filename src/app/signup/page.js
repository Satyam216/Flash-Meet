"use client";

import { useState } from "react";
import { signInWithGoogle } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard"); // Redirect to dashboard after signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleSignUp} className="px-4 py-2 bg-green-500 rounded">
        Sign Up with Google
      </button>
    </div>
  );
}
