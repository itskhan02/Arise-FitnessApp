import User from "../models/User.js";
import { applyExp } from "../utils/level.js";

/**
 * GET /api/user/me
 * Create user if first login
 */
export const getOrCreateUser = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({ clerkUserId });
    }

    res.json(user);
  } catch (err) {
    console.error("getOrCreateUser error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * POST /api/user/profile
 * Save onboarding data (one-time)
 */
export const updateProfile = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const {
      dob,
      age,
      gender,
      heightCm,
      weightKg,
      difficulty,
    } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        dob,
        age,
        gender,
        heightCm,
        weightKg,
        difficulty,
      },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * PATCH /api/user/weight
 */
export const updateWeight = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { weightKg } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId },
      { weightKg },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("updateWeight error:", err);
    res.status(500).json({ error: "Failed to update weight" });
  }
};

/**
 * PATCH /api/user/streak
 */
export const updateStreak = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { checkedDays } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        streak: {
          checkedDays,
          lastActivity: new Date(),
        },
      },
      { new: true }
    );

    res.json(user.streak);
  } catch (err) {
    console.error("updateStreak error:", err);
    res.status(500).json({ error: "Failed to update streak" });
  }
};

/**
 * PATCH /api/user/daily-quest
 */
export const saveDailyQuest = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { dailyQuest } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId },
      { dailyQuest },
      { new: true }
    );

    res.json(user.dailyQuest);
  } catch (err) {
    console.error("saveDailyQuest error:", err);
    res.status(500).json({ error: "Failed to save daily quest" });
  }
};

/**
 * POST /api/user/open-chest
 * Server-authoritative XP + stats
 */
export const openChest = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const user = await User.findOne({ clerkUserId });

    if (!user || user.dailyQuest?.chestOpened) {
      return res.status(400).json({ error: "Chest already opened" });
    }

    const gainedExp = user.dailyQuest.quests.reduce(
      (sum, q) => sum + q.exp,
      0
    );

    const statKeys = Object.keys(user.stats);
    const randomStat =
      statKeys[Math.floor(Math.random() * statKeys.length)];

    user.stats[randomStat] += 1;

    const result = applyExp(user.level, user.exp, gainedExp);
    user.level = result.level;
    user.exp = result.exp;
    user.dailyQuest.chestOpened = true;

    await user.save();

    res.json({
      level: user.level,
      exp: user.exp,
      stats: user.stats,
    });
  } catch (err) {
    console.error("openChest error:", err);
    res.status(500).json({ error: "Failed to open chest" });
  }
};
