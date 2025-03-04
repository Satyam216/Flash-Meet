"use client";
import { useRouter } from "next/navigation";

const Meetings = () => {
    const router = useRouter();

    const enterLobby = () => {
        router.push("/dashboard/meetings/lobby");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-2xl p-8 max-w-md text-center border border-white/20">
                <h1 className="text-4xl font-bold mb-4">Welcome to FlashMeet</h1>
                <p className="text-lg text-gray-200 mb-6">
                    Click below to enter the lobby and get matched.
                </p>
                <button
                    onClick={enterLobby}
                    className="px-6 py-3 bg-white text-blue-600 font-semibold text-lg rounded-xl shadow-md hover:bg-blue-100 transition-all duration-300"
                >
                    Enter Lobby
                </button>
            </div>
        </div>
    );
};

export default Meetings;
