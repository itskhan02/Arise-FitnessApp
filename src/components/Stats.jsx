import React, { useEffect, useState } from "react";
import StatChart from "./StatChart";

const USER_PROGRESS_KEY = "user_progress_history";

const Stats = () => {
  const [stats, setStats] = useState({
    strength: 0,
    stamina: 0,
    agility: 0,
    endurance: 0,
    mobility: 0,
  });

  const loadStats = () => {
    const data = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}");
    const dates = Object.keys(data).sort();
    if (dates.length > 0) {
      const latest = data[dates[dates.length - 1]];
      if (latest?.stats) setStats(latest.stats);
    }
  };

  useEffect(() => {
    loadStats();
    const updateHandler = () => loadStats();
    window.addEventListener("userExpUpdated", updateHandler);
    return () => window.removeEventListener("userExpUpdated", updateHandler);
  }, []);

  return <StatChart stats={stats} />;
};

export default Stats;
