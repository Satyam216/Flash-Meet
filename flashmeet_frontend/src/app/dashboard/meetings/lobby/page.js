"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // Firebase Auth Context se user lena

const Lobby = () => {
    const router = useRouter();
    const { user } = useAuth(); // Firebase authenticated user

    useEffect(() => {
        if (!user) return; // Agar user authenticated nahi hai toh kuch mat karo

        const userId = user.uid; // Firebase UID
        const ws = new WebSocket(`ws://localhost:5000?userId=${userId}`);

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "match_found") {
                console.log("Match found! Redirecting to room:", data.roomId);
                router.push(`/dashboard/meetings/room/${data.roomId}`);
            }
        };

        return () => ws.close();
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-blue-700 text-white p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-2xl p-8 max-w-md text-center border border-white/20">
                <h1 className="text-3xl font-bold mb-4">Waiting in Lobby...</h1>
                <p className="text-lg text-gray-200 mb-4">
                    Finding a match, please wait...
                </p>
            </div>
        </div>
    );
};

export default Lobby;
