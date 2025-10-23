import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const USER_PROGRESS_KEY = "user_progress_history";

const UserLevel = () => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);

  const getExpForLevel = (level) => Math.floor(1000 * Math.pow(1.1, level - 1));

  useEffect(() => {
    const progressHistoryRaw = localStorage.getItem(USER_PROGRESS_KEY);
    if (progressHistoryRaw) {
      const progressHistory = JSON.parse(progressHistoryRaw);
      const allDates = Object.keys(progressHistory).sort();

      if (allDates.length > 0) {
        const latestDate = allDates[allDates.length - 1];
        const latestProgress = progressHistory[latestDate];
        if (latestProgress) {
          const currentLevel = latestProgress.level || 1;
          const currentExp = latestProgress.exp || 0;
          setLevel(currentLevel);
          setExp(currentExp);
          setExpForNextLevel(getExpForLevel(currentLevel));
        }
      }
    }
  }, []);

  // 🔄 Listen for XP updates
  useEffect(() => {
    const onExpGain = () => {
      const progressHistoryRaw = localStorage.getItem(USER_PROGRESS_KEY);
      if (progressHistoryRaw) {
        const progressHistory = JSON.parse(progressHistoryRaw);
        const allDates = Object.keys(progressHistory).sort();
        if (allDates.length > 0) {
          const latestDate = allDates[allDates.length - 1];
          const latestProgress = progressHistory[latestDate];
          if (latestProgress) {
            setLevel(latestProgress.level);
            setExp(latestProgress.exp);
            setExpForNextLevel(getExpForLevel(latestProgress.level));
          }
        }
      }
    };

    window.addEventListener("userExpUpdated", onExpGain);
    return () => window.removeEventListener("userExpUpdated", onExpGain);
  }, []);

  const progressPercentage = Math.min((exp / expForNextLevel) * 100, 100);

  return (
    <motion.div
      style={{
        maxWidth: 500,
        width: "100%",
        margin: "0",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        borderRadius: 20,
        padding: "1rem 1.5rem",
        color: "#fff",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h3 style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.4rem" }}>
          Level {level}
        </h3>
        <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
          {exp} / {expForNextLevel} XP
        </span>
      </div>
      <div
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            width: `${progressPercentage}%`,
            background: "linear-gradient(90deg, #a78bfa, #f472b6)",
            height: "8px",
            borderRadius: "10px",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default UserLevel;
