import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";

import {
  getOrCreateUser,
  updateProfile,
  updateWeight,
  updateStreak,
  saveDailyQuest,
  openChest
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(requireAuth); // 🔐 EVERYTHING BELOW IS CLERK-SECURED

router.get("/me", getOrCreateUser);
router.post("/profile", updateProfile);
router.patch("/weight", updateWeight);
router.patch("/streak", updateStreak);
router.patch("/daily-quest", saveDailyQuest);
router.post("/open-chest", openChest);

export default router;
