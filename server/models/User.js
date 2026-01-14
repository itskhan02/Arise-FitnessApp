import mongoose from "mongoose";

const StreakSchema = new mongoose.Schema({
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  lastActive: { type: Date } // date of last activity (UTC)
}, { _id: false });

const StatsSchema = new mongoose.Schema({
  strength: { type: Number, default: 0 },
  stamina: { type: Number, default: 0 },
  agility: { type: Number, default: 0 },
  endurance: { type: Number, default: 0 },
  mobility: { type: Number, default: 0 },
  workoutsCompleted: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
}, { _id: false });

const DailyQuestSchema = new mongoose.Schema({
  lastDate: { type: String, default: null }, // YYYY-MM-DD
  quests: { type: Array, default: [] },
  chestOpened: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  // profile fields
  height: Number, // cm
  weight: Number, // kg
  age: Number,
  // numeric level and exp for gamification
  level: { type: Number, default: 1 }, // user's numeric level
  exp: { type: Number, default: 0 }, // current xp towards next level
  // optional difficulty label retained separately if needed
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  userLevel: { type: Number, default: 1 },
  stats: { type: StatsSchema, default: () => ({}) },
  streak: { type: StreakSchema, default: () => ({}) },
  dailyQuest: { type: DailyQuestSchema, default: () => ({}) }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
