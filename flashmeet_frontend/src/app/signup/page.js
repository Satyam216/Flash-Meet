"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Handle Signup
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic input validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send user info to backend
      await axios.post("http://localhost:5000/api/users", {
        name: user.displayName || "No Name",
        email: user.email,
        provider: "email",
      });

      // Redirect to login page after successful signup
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);

      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please use a different email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
        <p className="text-gray-400 text-center mb-4">Join us today and start networking!</p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent focus:outline-none text-white"
            />
          </div>

          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent focus:outline-none text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}