"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getAuth } from "firebase/auth";

const Room = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const ws = useRef(null); // ✅ WebSocket reference
    const reconnectInterval = useRef(null); // ✅ Reconnect timeout storage
    const auth = getAuth();
    const userId = auth.currentUser?.uid; // ✅ Get userId from Firebase Auth

    useEffect(() => {
        if (!userId) {
            console.error("❌ No user ID found. WebSocket connection aborted.");
            return;
        }

        connectWebSocket(); // ✅ Initialize WebSocket

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            clearInterval(reconnectInterval.current);
        };
    }, [roomId, userId]);

    const connectWebSocket = () => {
        if (!userId) return;

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log("✅ WebSocket already connected");
            return;
        }

        const wsUrl = `ws://localhost:5000?roomId=${roomId}&userId=${userId}`;
        console.log(`Connecting to WebSocket: ${wsUrl}`);
        
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("✅ Connected to WebSocket, Room:", roomId);
            sendPing();

            // ✅ Clear previous reconnection attempts
            clearInterval(reconnectInterval.current);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "chat") {
                setMessages((prev) => [...prev, { sender: data.sender, text: data.text }]);
            }
        };

        ws.current.onclose = () => {
            console.warn("❌ WebSocket closed. Reconnecting in 3 sec...");
            reconnectInterval.current = setTimeout(connectWebSocket, 3000); // ✅ Auto-reconnect
        };

        ws.current.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
            ws.current.close(); // ✅ Close WebSocket on error
        };
    };

    // ✅ Ping WebSocket server every 25 sec to prevent timeout
    const sendPing = () => {
        setInterval(() => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: "ping" }));
            }
        }, 25000);
    };

    const sendMessage = () => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            console.error("❌ WebSocket is not open. Trying to reconnect...");
            connectWebSocket();
            return;
        }

        ws.current.send(JSON.stringify({ type: "chat", text: message, sender: userId }));
        setMessage("");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Room ID: {roomId}</h1>
            <div className="border p-2 h-60 overflow-y-auto text-white bg-gray-800 rounded-lg">
                {messages.map((msg, index) => (
                    <p key={index} className="mb-1"><strong>{msg.sender}:</strong> {msg.text}</p>
                ))}
            </div>
            <div className="mt-2 flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="border p-2 text-black flex-grow rounded-l-lg"
                />
                <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r-lg">Send</button>
            </div>
        </div>
    );
};

export default Room;
