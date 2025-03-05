const mongoose = require("mongoose");

const WaitingUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WaitingUser", WaitingUserSchema);
