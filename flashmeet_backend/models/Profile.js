const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, immutable: true }, // ✅ Immutable email
  name: { type: String, required: true },
  occupation: { type: String },
  interests: { type: [String] }
});

module.exports = mongoose.model("Profile", ProfileSchema);
