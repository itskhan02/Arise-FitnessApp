import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const STREAK_KEY = "streak-checked-days";
const QUEST_HISTORY_KEY = "quest_history";

const ProgressChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // 1. Get streak data
    const streakRaw = localStorage.getItem(STREAK_KEY);
    const streakData = streakRaw ? JSON.parse(streakRaw) : { completed: [] };
    const checkedInDays = new Set(streakData.completed || []);

    // 2. Get quest history data
    const questHistoryRaw = localStorage.getItem(QUEST_HISTORY_KEY);
    const questHistory = questHistoryRaw ? JSON.parse(questHistoryRaw) : {};

    // 3. Find the first day of activity
    const allActivityDates = [
      ...(streakData.completed || []),
      ...Object.keys(questHistory),
    ].sort();

    if (allActivityDates.length === 0) {
      // No data to show yet, chart will be empty
      return;
    }

    const startDate = new Date(allActivityDates[0]);
    const today = new Date();

    // Calculate the total number of days to display
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 4. Combine data for the entire period
    const labels = [];
    const engagement = [];

    for (let i = diffDays; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().slice(0, 10);
      labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

      let engagementScore = 0;
      // Add 1 point for checking in (streak)
      if (checkedInDays.has(dateString)) engagementScore += 1;
      // Add 1 point for each completed quest
      if (questHistory[dateString]) engagementScore += questHistory[dateString].length;
      
      engagement.push(engagementScore);
    }

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Engagement",
          data: engagement,
          borderColor: "#a78bfa",
          backgroundColor: "rgba(167,139,250,0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#a78bfa",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
        },
      ],
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(3,7,18,0.9)",
        titleColor: "#e0e7ff",
        bodyColor: "#e0e7ff",
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#94a3b8", font: { size: 12 }, precision: 0 },
        grid: { color: "rgba(255,255,255,0.1)", borderDash: [3, 3] },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        borderRadius: 20,
        padding: "1.5rem 1rem",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <h3 style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.4rem", marginBottom: "1rem" }}>
        Engagement (Last 30 Days)
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;
