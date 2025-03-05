"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { FaUsers, FaVideo, FaRocket } from "react-icons/fa";

const socket = io("http://localhost:5000");

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold mb-4 text-center animate-fadeIn"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-blue-500">FlashMeet</span>
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-400 mb-8 text-center max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Connect, Network, and Grow – One Flash Meet at a Time!
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold transition-all duration-300 shadow-md transform hover:scale-105"
        >
          Register Now
        </button>
        <button
          onClick={() => router.push("/about")}
          className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md transform hover:scale-105"
        >
          Learn More
        </button>
      </motion.div>

      {/* Connection Status */}
      <motion.p
        className="mt-6 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
      </motion.p>

      {/* Features Section */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <FeatureCard
          icon={<FaUsers size={32} className="text-blue-500" />}
          title="Meet New People"
          description="Instantly connect with strangers and make meaningful conversations."
        />
        <FeatureCard
          icon={<FaVideo size={32} className="text-green-500" />}
          title="Video & Text Chat"
          description="Enjoy high-quality video calls or opt for text-based networking."
        />
        <FeatureCard
          icon={<FaRocket size={32} className="text-purple-500" />}
          title="Fast & Secure"
          description="Powered by WebSockets and Firebase for seamless and secure interactions."
        />
      </motion.div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
