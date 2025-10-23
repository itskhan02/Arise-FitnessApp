import React, { useState, useEffect } from "react";
import StatChart from "./StatChart";

const USER_PROGRESS_KEY = "user_progress_history";

const Stats = () => {
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const progressHistoryRaw = localStorage.getItem(USER_PROGRESS_KEY);
    if (progressHistoryRaw) {
      const progressHistory = JSON.parse(progressHistoryRaw);
      const allDates = Object.keys(progressHistory).sort();
      if (allDates.length > 0) {
        const latestDate = allDates[allDates.length - 1];
        const latestStats = progressHistory[latestDate].stats;

        const chartData = [
          { stat: "Strength", value: latestStats.strength || 0 },
          { stat: "Stamina", value: latestStats.stamina || 0 },
          { stat: "Agility", value: latestStats.agility || 0 },
          { stat: "Endurance", value: latestStats.endurance || 0 }, 
          { stat: "Mobility", value: latestStats.mobility || 0 }, 
        ];
        setUserStats(chartData);
      }
    }
  }, []);

  return (
    <StatChart stats={userStats} />
  );
};

export default Stats;
