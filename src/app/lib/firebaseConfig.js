// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider , signInWithPopup, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCC9_WQt8dGgBAqTEsfkhLZUWyMTx9i0Pg",
  authDomain: "flash-meet-b3c1e.firebaseapp.com",
  projectId: "flash-meet-b3c1e",
  storageBucket: "flash-meet-b3c1e.firebasestorage.app",
  messagingSenderId: "704975379498",
  appId: "1:704975379498:web:5ccc7b9f61b3bf92e53753"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

//sign in with google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Sign Out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export { auth, googleProvider };