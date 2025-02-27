"use client";
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import "../../styles/login.css"; // Import CSS file

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

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
        <a>
          <fieldset >
            <p >Email Id <input type="text" name = "Email" placeholder="Enter your email" required></input></p>
            <p>Password <input type="text" name = "password" placeholder="Enter your password "required></input></p>
          </fieldset>
          </a>
        <h2 className="subtitle">Login</h2>
        {error && <p className="error">{error}</p>}
        
        <button className="btn" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
