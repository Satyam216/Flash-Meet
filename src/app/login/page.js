"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebaseConfig"; // Make sure the path is correct
import { useRouter } from "next/navigation";
import "../../styles/login.css"; // Import CSS file

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle Login with Email & Password
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  // Handle Login with Google
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      setError("Login Failed! Try Again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">Flash Meet</h1>
        <h2 className="subtitle">Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleEmailSignIn} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn">Sign in with Email</button>
        </form>

        <p className="or-text">OR</p>

        <button className="btn google-btn" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
