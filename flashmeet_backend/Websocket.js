const WebSocket = require("ws");
const Room = require("./models/Room");
const WaitingUser = require("./models/waitingUser");

const activeUsers = new Map();
const waitingQueue = [];

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", async (ws, req) => {
        const urlParams = new URLSearchParams(req.url.split("?")[1]);
        const userId = urlParams.get("userId");

        if (!userId) {
            console.log("Invalid connection: No user ID");
            ws.close();
            return;
        }

        activeUsers.set(userId, ws);
        console.log(`User connected: ${userId}`);

        waitingQueue.push(userId);
        matchUsers();

        ws.on("message", async (message) => {
            const data = JSON.parse(message);
            if (data.type === "chat_message") {
                const { roomId, text } = data;
                broadcastMessage(roomId, userId, text);
            }
        });

        ws.on("close", () => {
            console.log(`User disconnected: ${userId}`);
            activeUsers.delete(userId);
            removeFromQueue(userId);
        });
    });
}

async function matchUsers() {
    while (waitingQueue.length >= 2) {
        const user1 = waitingQueue.shift();
        const user2 = waitingQueue.shift();

        const ws1 = activeUsers.get(user1);
        const ws2 = activeUsers.get(user2);

        if (ws1 && ws2) {
            let room = await Room.findOne({ users: { $all: [user1, user2] } });

            if (!room) {
                const roomId = `room-${user1}-${user2}`;
                room = new Room({ roomId, users: [user1, user2] });
                await room.save();
            }

            ws1.send(JSON.stringify({ type: "match_found", roomId: room.roomId, partnerId: user2 }));
            ws2.send(JSON.stringify({ type: "match_found", roomId: room.roomId, partnerId: user1 }));

            console.log(`Matched users: ${user1} & ${user2} in room ${room.roomId}`);
        }
    }
}

function broadcastMessage(roomId, senderId, text) {
    Room.findOne({ roomId }).then((room) => {
        if (!room) return;

        room.users.forEach((user) => {
            if (activeUsers.has(user)) {
                activeUsers.get(user).send(
                    JSON.stringify({ type: "chat_message", senderId, text })
                );
            }
        });
    });
}

function removeFromQueue(userId) {
    const index = waitingQueue.indexOf(userId);
    if (index !== -1) waitingQueue.splice(index, 1);
}

module.exports = setupWebSocket;
