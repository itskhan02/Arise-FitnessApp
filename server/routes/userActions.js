const express = require('express');
const User = require('../models/User');

const router = express.Router();

// helper to get clerkId (duplicate of users.js helper for simplicity)
function getClerkIdFromReq(req) {
  const headerId = req.header('x-clerk-user-id');
  if (headerId) return headerId;
  const auth = req.header('Authorization') || req.header('authorization');
  if (!auth) return null;
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const payloadPart = token.split('.')[1];
    const json = Buffer.from(payloadPart || '', 'base64').toString('utf8');
    const payload = JSON.parse(json);
    return payload.sub || payload.user_id || payload.clerkId || null;
  } catch (e) {
    return null;
  }
}

// PATCH /api/user/daily-quest
router.patch('/daily-quest', async (req, res) => {
  const clerkId = getClerkIdFromReq(req);
  if (!clerkId) return res.status(401).json({ error: 'Missing clerk id' });

  const { dailyQuest } = req.body || {};
  if (!dailyQuest || !dailyQuest.lastDate) {
    return res.status(400).json({ error: 'Missing dailyQuest payload' });
  }

  const user = await User.findOneAndUpdate(
    { clerkId },
    { $set: { dailyQuest } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return res.json({ ok: true, dailyQuest: user.dailyQuest });
});

// POST /api/user/open-chest
router.post('/open-chest', async (req, res) => {
  const clerkId = getClerkIdFromReq(req);
  if (!clerkId) return res.status(401).json({ error: 'Missing clerk id' });

  const user = await User.findOne({ clerkId });
  if (!user || !user.dailyQuest || !user.dailyQuest.lastDate) {
    return res.status(400).json({ error: 'No daily quests found for user' });
  }

  if (user.dailyQuest.chestOpened) {
    return res.status(400).json({ error: 'Chest already opened' });
  }

  const quests = Array.isArray(user.dailyQuest.quests) ? user.dailyQuest.quests : [];
  if (!quests.length) return res.status(400).json({ error: 'No quests to open chest for' });

  // ensure all quests are completed and not failed
  const allCompleted = quests.length > 0 && quests.every(q => q.completed && !q.failed);
  if (!allCompleted) {
    return res.status(400).json({ error: 'Complete all quests first' });
  }

  // compute total exp reward and random stat increase
  const totalExp = quests.reduce((s, q) => s + (Number(q.exp) || 0), 0);

  // basic exp -> level mechanic
  const getExpForLevel = (lvl) => Math.floor(1000 * Math.pow(1.1, lvl - 1));
  let newLevel = user.level || 1;
  let remainingExp = (user.exp || 0) + totalExp;
  let expToNext = getExpForLevel(newLevel);

  while (remainingExp >= expToNext) {
    remainingExp -= expToNext;
    newLevel++;
    expToNext = getExpForLevel(newLevel);
  }

  // pick a random stat to increment
  const statKeys = ['strength','stamina','agility','endurance','mobility'];
  const randomKey = statKeys[Math.floor(Math.random() * statKeys.length)];
  user.stats = user.stats || {};
  user.stats[randomKey] = (user.stats[randomKey] || 0) + 1;

  // mark chest opened and assign rewards
  user.dailyQuest.chestOpened = true;
  user.level = newLevel;
  user.exp = remainingExp;

  await user.save();

  return res.json({
    ok: true,
    level: user.level,
    exp: user.exp,
    stats: user.stats,
    dailyQuest: user.dailyQuest
  });
});

// POST /api/user/complete-quest
router.post('/complete-quest', async (req, res) => {
  const clerkId = getClerkIdFromReq(req);
  if (!clerkId) return res.status(401).json({ error: 'Missing clerk id' });

  const { quest } = req.body || {};
  if (!quest || !quest.name) return res.status(400).json({ error: 'Missing quest payload' });

  // ensure user
  let user = await User.findOne({ clerkId });
  const today = new Date().toISOString().slice(0, 10);
  if (!user) {
    user = await User.create({
      clerkId,
      dailyQuest: { lastDate: today, quests: [], chestOpened: false }
    });
  }

  // init dailyQuest for today if needed
  if (!user.dailyQuest || user.dailyQuest.lastDate !== today) {
    user.dailyQuest = { lastDate: today, quests: [], chestOpened: false };
  }

  // mark or insert quest as completed
  const qi = user.dailyQuest.quests.findIndex(q => q.name === quest.name);
  const completedQuest = { ...quest, completed: true, failed: false };
  if (qi === -1) {
    user.dailyQuest.quests.push(completedQuest);
  } else {
    user.dailyQuest.quests[qi] = { ...user.dailyQuest.quests[qi], ...completedQuest };
  }

  // add exp
  const addExp = Number(quest.exp) || 0;
  user.exp = (user.exp || 0) + addExp;

  // recalc level
  const getExpForLevel = (lvl) => Math.floor(1000 * Math.pow(1.1, lvl - 1));
  let newLevel = user.level || 1;
  let remainingExp = user.exp;
  let expToNext = getExpForLevel(newLevel);
  while (remainingExp >= expToNext) {
    remainingExp -= expToNext;
    newLevel++;
    expToNext = getExpForLevel(newLevel);
  }
  user.level = newLevel;
  user.exp = remainingExp;

  // update simple workout stats
  user.stats = user.stats || {};
  user.stats.workoutsCompleted = (user.stats.workoutsCompleted || 0) + 1;
  user.stats.points = (user.stats.points || 0) + addExp;

  // update streak (reuse logic similar to /streak)
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const lastActive = user.streak?.lastActive ? new Date(user.streak.lastActive) : null;
  let diffDays = null;
  if (lastActive) {
    const lastUtc = new Date(Date.UTC(lastActive.getUTCFullYear(), lastActive.getUTCMonth(), lastActive.getUTCDate()));
    diffDays = Math.floor((todayUtc - lastUtc) / (24 * 60 * 60 * 1000));
  }

  if (diffDays === 0) {
    // already counted today -> nothing
  } else if (diffDays === 1 || lastActive === null) {
    user.streak.currentStreak = (user.streak.currentStreak || 0) + 1;
    user.streak.bestStreak = Math.max(user.streak.bestStreak || 0, user.streak.currentStreak);
    user.streak.lastActive = todayUtc;
  } else {
    user.streak.currentStreak = 1;
    user.streak.lastActive = todayUtc;
    user.streak.bestStreak = Math.max(user.streak.bestStreak || 0, user.streak.currentStreak);
  }

  await user.save();

  return res.json({
    ok: true,
    level: user.level,
    exp: user.exp,
    stats: user.stats,
    streak: user.streak,
    dailyQuest: user.dailyQuest
  });
});

// POST /api/user/login
router.post('/login', async (req, res) => {
  const clerkId = getClerkIdFromReq(req) || req.body?.clerkId;
  if (!clerkId) {
    return res.status(400).json({ error: 'Missing clerk id (provide x-clerk-user-id or Authorization token or body.clerkId)' });
  }

  // optional profile fields from frontend
  const { email, name, height, weight, age, level, exp } = req.body || {};

  const update = {
    clerkId,
    ...(height !== undefined ? { height } : {}),
    ...(weight !== undefined ? { weight } : {}),
    ...(age !== undefined ? { age } : {}),
    ...(level !== undefined ? { level } : {}),
    ...(exp !== undefined ? { exp } : {}),
  };

  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json({ ok: true, user });
  } catch (err) {
    console.error("login upsert failed:", err);
    return res.status(500).json({ error: 'Failed to upsert user' });
  }
});

module.exports = router;
