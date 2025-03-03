"use client";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    name: "",
    occupation: "",
    interests: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/profile/${user.uid}`).then((res) => {
        if (res.data.success) setProfile(res.data.user);
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      await axios.post("http://localhost:5000/api/profile", {
        uid: user.uid,
        name: profile.name,
        occupation: profile.occupation,
        interests: profile.interests.split(","),
      });
      alert("Profile updated!");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96 text-center">
        
        <div className="space-y-4">
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
