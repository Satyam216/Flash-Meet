const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// 🔹 Profile Create or Update API
router.post("/profile", async (req, res) => {
  try {
    const { uid, email, name, profilePicture, occupation, interests } = req.body;

    if (!uid || !email || !name) {
      return res.status(400).json({ error: "UID, Email, and Name are required" });
    }

    // 🔹 Pehle check karein ki profile exist karta hai ya nahi
    let existingProfile = await Profile.findOne({ uid });

    if (existingProfile) {
      // ✅ Agar profile mil gaya to update karein
      existingProfile.name = name;
      existingProfile.profilePicture = profilePicture;
      existingProfile.occupation = occupation || existingProfile.occupation;
      existingProfile.interests = interests || existingProfile.interests;

      await existingProfile.save();
      return res.status(200).json({ message: "Profile updated successfully", profile: existingProfile });
    }

    // ✅ Naya profile create karein agar pehle nahi tha
    const newProfile = new Profile({
      uid,
      email,
      name,
      profilePicture,
      occupation,
      interests,
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get Single Profile API (GET by `uid` or `email`)
router.get("/profile", async (req, res) => {
  try {
    const { uid, email } = req.query;

    if (!uid && !email) {
      return res.status(400).json({ error: "UID or Email is required to fetch profile" });
    }

    // ✅ `uid` ko priority di gayi, agar `uid` nahi hai to `email` se search hoga.
    const profile = await Profile.findOne(uid ? { uid } : { email });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ profile });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
