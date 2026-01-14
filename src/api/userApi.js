// src/api/userApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create user if first login
export const loginUser = async (clerkUserId) => {
  const res = await axios.post(`${API_URL}/user/login`, { clerkUserId });
  return res.data;
};

//  user data

export const getUserData = async (clerkUserId) => {
  const res = await axios.get(`${API_URL}/user/${clerkUserId}`);
  return res.data;
};

// Update user data (exp, level, stats, dailyQuest, streak etc.)

export const updateUserData = async (clerkUserId, updates) => {
  const res = await axios.post(`${API_URL}/user/update`, {
    clerkUserId,
    updates,
  });
  return res.data;
};

// OPEN CHEST (server computes XP, level up and picks random stat)

export const openChestApi = async (clerkUserId) => {
  const res = await axios.post(`${API_URL}/quest/open-chest`, {
    clerkUserId,
  });
  return res.data;
};

export async function saveDailyQuest(tokenOrClerkId, dailyQuest) {
  if (!tokenOrClerkId || !dailyQuest) return null;
  const headers = { "Content-Type": "application/json" };
  // token vs clerk id detection (token starts with typical prefixes)
  if (
    String(tokenOrClerkId || "").startsWith("ey") ||
    String(tokenOrClerkId || "").startsWith("pk_") ||
    String(tokenOrClerkId || "").startsWith("sk_")
  ) {
    headers.Authorization = `Bearer ${tokenOrClerkId}`;
  } else {
    headers["x-clerk-user-id"] = tokenOrClerkId;
  }
  return safeFetch(`${API_BASE.replace(/\/+$/, "")}/user/daily-quest`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ dailyQuest }),
  });
}

export async function completeQuest(tokenOrClerkId, quest) {
  if (!tokenOrClerkId || !quest) return null;
  const headers = { "Content-Type": "application/json" };
  if (
    String(tokenOrClerkId || "").startsWith("ey") ||
    String(tokenOrClerkId || "").startsWith("pk_") ||
    String(tokenOrClerkId || "").startsWith("sk_")
  ) {
    headers.Authorization = `Bearer ${tokenOrClerkId}`;
  } else {
    headers["x-clerk-user-id"] = tokenOrClerkId;
  }
  return safeFetch(`${API_BASE.replace(/\/+$/, "")}/user/complete-quest`, {
    method: "POST",
    headers,
    body: JSON.stringify({ quest }),
  });
}




// export default {
//   getMe,
//   getUserData,
//   updateUserData,
//   openChestApi,
//   saveDailyQuest,
//   completeQuest,
// };




