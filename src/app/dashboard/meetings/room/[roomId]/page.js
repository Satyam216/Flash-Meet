"use client";
import { useParams } from "next/navigation";

const Room = () => {
    const { roomId } = useParams(); // Get room ID from URL

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Room</h1>
                <p className="text-lg text-gray-300 mb-6">Room ID: <span className="font-semibold text-green-400">{roomId}</span></p>
                <p className="text-lg">Your video/text chat will start soon.</p>
            </div>
        </div>
    );
};

export default Room;
