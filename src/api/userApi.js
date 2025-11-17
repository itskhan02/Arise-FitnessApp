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


