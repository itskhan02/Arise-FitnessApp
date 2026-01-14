const express = require('express');
const User = require('../models/User');

const router = express.Router();

// helper: try to extract clerkId from request
function getClerkIdFromReq(req) {
  const headerId = req.header('x-clerk-user-id');
  if (headerId) return headerId;
  const auth = req.header('Authorization') || req.header('authorization');
  if (!auth) return null;
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  // best-effort decode JWT payload to read 'sub' or 'userId' claims
  try {
    const payloadPart = token.split('.')[1];
    const json = Buffer.from(payloadPart || '', 'base64').toString('utf8');
    const payload = JSON.parse(json);
    return payload.sub || payload.user_id || payload.clerkId || null;
  } catch (e) {
    return null;
  }
}

// middleware
router.use((req, res, next) => {
  const clerkId = getClerkIdFromReq(req);
  if (!clerkId) {
    return res.status(401).json({ error: 'Missing clerk id (x-clerk-user-id) or valid Authorization token' });
  }
  req.clerkId = clerkId;
  next();
});

// GET /api/users/me
router.get('/me', async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/users  -> create or update (upsert)
router.post('/', async (req, res) => {
  const payload = req.body || {};
  const update = { ...payload, clerkId: req.clerkId };
  const user = await User.findOneAndUpdate({ clerkId: req.clerkId }, update, { new: true, upsert: true, setDefaultsOnInsert: true });
  res.json(user);
});

// PATCH /api/users/stats -> merge stats (incremental)
router.patch('/stats', async (req, res) => {
  const { workoutsCompleted = 0, caloriesBurned = 0, points = 0 } = req.body || {};
  const user = await User.findOneAndUpdate(
    { clerkId: req.clerkId },
    {
      $inc: {
        'stats.workoutsCompleted': workoutsCompleted,
        'stats.caloriesBurned': caloriesBurned,
        'stats.points': points
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(user);
});

// PATCH /api/users/streak -> mark today's activity (updates streak correctly)
router.patch('/streak', async (req, res) => {
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  let user = await User.findOne({ clerkId: req.clerkId });
  if (!user) {
    user = await User.create({ clerkId: req.clerkId, streak: { currentStreak: 0, bestStreak: 0 } });
  }

  const lastActive = user.streak.lastActive ? new Date(user.streak.lastActive) : null;
  let diffDays = null;
  if (lastActive) {
    const lastUtc = new Date(Date.UTC(lastActive.getUTCFullYear(), lastActive.getUTCMonth(), lastActive.getUTCDate()));
    const msPerDay = 24 * 60 * 60 * 1000;
    diffDays = Math.floor((todayUtc - lastUtc) / msPerDay);
  }

  let updated = false;
  if (diffDays === 0) {
    // already active today: no change
  } else if (diffDays === 1 || lastActive === null) {
    user.streak.currentStreak = (user.streak.currentStreak || 0) + 1;
    user.streak.bestStreak = Math.max(user.streak.bestStreak || 0, user.streak.currentStreak);
    user.streak.lastActive = todayUtc;
    updated = true;
  } else {
    user.streak.currentStreak = 1;
    user.streak.lastActive = todayUtc;
    user.streak.bestStreak = Math.max(user.streak.bestStreak || 0, user.streak.currentStreak);
    updated = true;
  }

  if (updated) await user.save();
  res.json({ streak: user.streak });
});

module.exports = router;
