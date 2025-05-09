"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // Firebase Auth Context

const Lobby = () => {
    const router = useRouter();
    const { user } = useAuth(); // Get authenticated user
    const [interests, setInterests] = useState([]); // Store user interests
    const [loading, setLoading] = useState(true); // Loading state
    const [ws, setWs] = useState(null); // WebSocket instance

    useEffect(() => {
        if (!user) return; // If not authenticated, do nothing

        const fetchUserInterests = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/profile?uid=${user.uid}`);
                const data = await response.json();

                if (data.profile && data.profile.interests) {
                    setInterests(data.profile.interests);
                }
            } catch (error) {
                console.error("Error fetching user interests:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUserInterests();
    }, [user]);

    useEffect(() => {
        if (!user || interests.length === 0 || loading) return; // Ensure interests are loaded

        const userId = user.uid;
        const socket = new WebSocket(`ws://localhost:5000?userId=${userId}&interests=${interests.join(",")}`);

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "match_found") {
                console.log("Match found! Redirecting to room:", data.roomId);
                router.push(`/dashboard/meetings/room/${data.roomId}`);
            } else if (data.type === "session_ended") {
                alert("Your 5-minute session has ended!");
                router.push("/dashboard");
            }
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [user, interests, loading]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-blue-700 text-white p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-2xl p-8 max-w-md text-center border border-white/20">
                <h1 className="text-3xl font-bold mb-4">Waiting in Lobby...</h1>
                <p className="text-lg text-gray-200 mb-4">
                    {loading ? "Loading your profile..." : "Finding a match, please wait..."}
                </p>
            </div>
        </div>
    );
};

export default Lobby;
