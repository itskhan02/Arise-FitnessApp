import React, { useState, useEffect } from "react";
import { getUserData } from "../api/userApi";

const STATS_KEY = "user_stats"; // same key used when saving stats

const Stats = ({ stats }) => {
  const [currentStats, setCurrentStats] = useState(() => {
    const savedStats = localStorage.getItem(STATS_KEY);
    return savedStats ? JSON.parse(savedStats) : stats || {};
  });

  useEffect(() => {
    // If parent props change, update
    if (stats && Object.keys(stats).length > 0) {
      setCurrentStats(stats);
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  useEffect(() => {
    const handleStatsUpdate = (event) => {
      const newStats = event.detail;
      setCurrentStats((prev) => {
        const updated = { ...prev, ...newStats };
        localStorage.setItem(STATS_KEY, JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("statsUpdated", handleStatsUpdate);
    return () => window.removeEventListener("statsUpdated", handleStatsUpdate);
  }, []);

  useEffect(() => {
    // try server
    const clerkUserId = localStorage.getItem("clerkUserId");
    if (clerkUserId) {
      getUserData(clerkUserId)
        .then((u) => {
          if (u?.stats && Object.keys(u.stats).length > 0) {
            setCurrentStats(u.stats);
            localStorage.setItem(STATS_KEY, JSON.stringify(u.stats));
          }
        })
        .catch(() => {
          // ignore and keep local fallback
        });
    }
  }, []);

  return (
    <div
      className="stats-card"
      style={{
        height: 350,
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
        justifyContent: "flex-start",
        gap: "2.5rem",
      }}
    >
      <h2 style={{color: "#4178f0ff", fontWeight: "600", fontSize: "1.5rem"}}>Stats</h2>
      <div className="stats-list"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        fontSize: "1.2rem",
      }}
      >
        {Object.keys(currentStats).length > 0 ? (
          Object.keys(currentStats).map((key) => (
            <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "3.5rem",
            }}
            key={key} className="stats-item">
              <span className="stats-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className="stats-value">{currentStats[key]}</span>
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.6 }}>No stats yet</p>
        )}
      </div>
    </div>
  );
};

export default Stats;





