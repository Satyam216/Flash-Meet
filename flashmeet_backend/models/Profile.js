const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // ✅ Firebase UID (Unique Identifier)
  email: { type: String, required: true, unique: true, immutable: true }, // ✅ Immutable Email
  name: { type: String, required: true },
  profilePicture: { type: String }, // ✅ Firebase Photo URL
  occupation: { type: String, default: "" }, // ✅ Default empty string
  interests: { type: [String], default: [] }, // ✅ Default empty array
}, { timestamps: true }); // ✅ Timestamps for createdAt & updatedAt

module.exports = mongoose.model("Profile", ProfileSchema);
