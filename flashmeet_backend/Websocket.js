const WebSocket = require("ws");
const http = require("http");

const wss = new WebSocket.Server({ noServer: true });
const waitingUsers = [];

function setupWebSocket(server) {
    server.on("upgrade", (request, socket, head) => {
        const { searchParams } = new URL(request.url, "http://localhost");

        const userId = searchParams.get("userId");
        const interests = searchParams.get("interests")?.split(",") || [];

        if (!userId) {
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            ws.userId = userId;
            ws.interests = interests;
            ws.isAlive = true;
            ws.roomId = null;

            matchUser(ws);
        });
    });
}

function matchUser(ws) {
    console.log(`🔗 User ${ws.userId} connected with interests: ${ws.interests}`);

    for (let i = 0; i < waitingUsers.length; i++) {
        const otherUser = waitingUsers[i];

        // ✅ Match based on at least one common interest
        const commonInterests = ws.interests.filter(interest => otherUser.interests.includes(interest));

        if (commonInterests.length > 0) {
            // 🛑 Remove matched user from waiting list
            waitingUsers.splice(i, 1);

            // ✅ Use existing room ID if the other user was waiting, otherwise create a new one
            const roomId = otherUser.roomId || `room-${Date.now()}`;
            ws.roomId = roomId;
            otherUser.roomId = roomId;

            // 📢 Notify both users about the match
            try {
                ws.send(JSON.stringify({ type: "match_found", roomId }));
                otherUser.send(JSON.stringify({ type: "match_found", roomId }));
                console.log(`✅ Matched users ${ws.userId} and ${otherUser.userId} in Room: ${roomId}`);
            } catch (error) {
                console.error("Error sending match data:", error);
            }

            // ⏳ End session in 5 minutes
            setTimeout(() => {
                try {
                    ws.send(JSON.stringify({ type: "session_ended" }));
                    otherUser.send(JSON.stringify({ type: "session_ended" }));
                    ws.close();
                    otherUser.close();
                } catch (e) {
                    console.error("Error ending session:", e);
                }
            }, 5 * 60 * 1000);

            return;
        }
    }

    // ❌ No match found, add user to waiting list
    ws.roomId = `room-${Date.now()}`;
    waitingUsers.push(ws);
    console.log(`🕒 User ${ws.userId} added to waiting queue with Room: ${ws.roomId}`);
}

module.exports = setupWebSocket;
