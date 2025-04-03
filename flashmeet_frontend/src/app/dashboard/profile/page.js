"use client";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    uid: user?.uid || "",
    email: user?.email || "",
    name: "",
    profilePicture: user?.photoURL || "",
    occupation: "",
    interests: "",
  });

  const [editMode, setEditMode] = useState(false);

  // 🔹 Profile Fetch Karega Jab Component Load Hoga
  useEffect(() => {
    if (user?.uid) {
      axios
        .get(`http://localhost:5000/api/profile?uid=${user.uid}`)
        .then((res) => {
          if (res.data.profile) {
            setProfile({
              uid: res.data.profile.uid,
              email: res.data.profile.email,
              name: res.data.profile.name,
              profilePicture: res.data.profile.profilePicture || user?.photoURL || "",
              occupation: res.data.profile.occupation || "",
              interests: res.data.profile.interests?.join(", ") || "",
            });
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  // 🔹 Profile Create or Update
  const handleUpdate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/profile", {
        uid: profile.uid, // ✅ Firebase UID send karna zaroori hai
        email: profile.email, // ✅ Email bhi send hoga (immutable hai)
        name: profile.name.trim(),
        profilePicture: profile.profilePicture,
        occupation: profile.occupation.trim(),
        interests: profile.interests.split(",").map((i) => i.trim()), // String to Array conversion
      });

      alert(response.data.message || "Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to update profile!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96 text-center">
        
        {/* 🔹 Profile Picture */}
        <div className="flex justify-center">
          <img
            src={profile.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-blue-500 mb-4"
          />
        </div>

        <div className="space-y-4">
          {/* 🔹 Email (Non-Editable) */}
          <p className="text-sm text-gray-400">Email: {profile.email}</p>

          {/* 🔹 Name */}
          {editMode ? (
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100 text-black"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
          ) : (
            <h2 className="text-2xl font-bold text-indigo-400">{profile.name || "Your Name"}</h2>
          )}

          {/* 🔹 Occupation */}
          {editMode ? (
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100 text-black"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              placeholder="Occupation"
            />
          ) : (
            <p className="text-lg text-gray-400">{profile.occupation || "Your Occupation"}</p>
          )}

          {/* 🔹 Interests */}
          {editMode ? (
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100 text-black"
              value={profile.interests}
              onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
              placeholder="Interests (comma separated)"
            />
          ) : (
            <p className="text-gray-500 font-semibold">Interests: {profile.interests || "N/A"}</p>
          )}
        </div>

        {/* 🔹 Edit & Save Button */}
        <button
          onClick={editMode ? handleUpdate : () => setEditMode(true)}
          className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {editMode ? "Save" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}
