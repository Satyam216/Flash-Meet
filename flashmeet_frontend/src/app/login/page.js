"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../lib/firebaseConfig"; // Import GitHub provider
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaGithub } from "react-icons/fa"; // GitHub icon

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Function to Save User in MongoDB
  const saveUserToDB = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid, // Firebase UID
          name: user.displayName || "No Name",
          email: user.email || "No Email",
          profilePicture: user.photoURL || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user to database");
      }
    } catch (err) {
      console.error("Database Save Error:", err);
    }
  };

  // ✅ Handle Email & Password Login
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToDB(result.user); // Save user to MongoDB
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  // ✅ Handle Google Login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToDB(result.user); // Save user to MongoDB
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      setError("Google Login Failed! Try Again.");
    }
  };

  // ✅ Handle GitHub Login
  const handleGitHubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await saveUserToDB(result.user); // Save user to MongoDB
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      console.error("GitHub Login Error:", err);
      setError("GitHub Login Failed! Try Again.");
    }
  };

  // Handle navigation to the signup page
  const handleSignUpNavigation = () => {
    router.push("/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-2">Flash Meet</h1>
        <h2 className="text-xl text-gray-400 text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign in
          </button>
        </form>

        <p className="text-gray-400 text-center my-4">OR</p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg transition duration-300 mb-4"
        >
          <FcGoogle className="mr-2" /> Sign in with Google
        </button>

        {/* GitHub Login Button */}
        <button
          onClick={handleGitHubSignIn}
          className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          <FaGithub className="mr-2" /> Sign in with GitHub
        </button>

        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={handleSignUpNavigation}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
