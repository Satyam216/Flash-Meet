const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// Profile Create or Update API
router.post("/profile", async (req, res) => {
  try {
    const { email, name, occupation, interests } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and Name are required" });
    }

    // 🔹 Pehle check karein ki profile exist karta hai ya nahi
    let existingProfile = await Profile.findOne({ email });

    if (existingProfile) {
      // ✅ Agar profile mil gaya to update karein
      existingProfile.name = name;
      existingProfile.occupation = occupation;
      existingProfile.interests = interests;
      await existingProfile.save();

      return res.status(200).json({ message: "Profile updated successfully", profile: existingProfile });
    }

    // ✅ Naya profile create karein agar pehle nahi tha
    const newProfile = new Profile({ email, name, occupation, interests });
    await newProfile.save();

    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Profile API
// Get Single Profile API (GET by email)
router.get("/profile", async (req, res) => {
    try {
      const email = req.query.email; // ✅ Query parameter se email fetch karein
  
      if (!email) {
        return res.status(400).json({ error: "Email is required to fetch profile" });
      }
  
      // Find profile by email
      const profile = await Profile.findOne({ email });
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
  
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
