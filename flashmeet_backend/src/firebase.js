
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


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
export const auth = getAuth(app);
export default app;