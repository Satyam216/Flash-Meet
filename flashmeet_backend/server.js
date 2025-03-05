require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const setupWebSocket = require("./Websocket");

const app = express();
const server = http.createServer(app); // Create HTTP Server

setupWebSocket(server); // WebSocket Handling

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error(" MONGO_URI is not defined in .env file!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Users Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// Users POST API - Ye Code Same Rahega
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and Email are required!" });

    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ status: "success", message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Users GET API - Ye Code Same Rahega
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Protected Routes
const protectedRoutes = require("./routes/protectedRoutes");
app.use("/api", protectedRoutes);

// Profile Routes (Correctly Added)
const profileRoutes = require("./routes/profileRoutes");
app.use("/api", profileRoutes); // Profile Routes Include Kiye

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
