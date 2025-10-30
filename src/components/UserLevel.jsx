import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const USER_PROGRESS_KEY = "user_progress_history";

const UserLevel = () => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);

  const getExpForLevel = (lvl) => Math.floor(1000 * Math.pow(1.15, lvl - 1));

  const loadProgress = () => {
    const data = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY)) || {};
    const latest = Object.values(data).pop();
    if (latest) {
      setLevel(latest.level || 1);
      setExp(latest.exp || 0);
      setExpForNextLevel(getExpForLevel(latest.level || 1));
    }
  };

  useEffect(() => {
    loadProgress();
    window.addEventListener("userProgressUpdated", loadProgress);
    return () => window.removeEventListener("userProgressUpdated", loadProgress);
  }, []);

  const percent = Math.min((exp / expForNextLevel) * 100, 100);

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
          height: "10px",
          borderRadius: "10px",
          marginTop: "10px",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "linear-gradient(90deg, #a78bfa, #f472b6)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default UserLevel;
