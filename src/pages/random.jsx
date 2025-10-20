import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const random = () => {
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");

  const handleUpdateProfile = async () => {
    try {
      await user.update({
        username,
        imageUrl,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Edit Profile</h2>
      <label>Username</label>
      <input
        className="border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Profile Image URL</label>
      <input
        className="border p-2 rounded"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button
        onClick={handleUpdateProfile}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default random;
