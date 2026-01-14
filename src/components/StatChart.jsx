import React, { useEffect, useState } from "react";
import { Radar as RadarJS } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import { getUserData } from "../api/userApi";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const StatChart = ({ stats }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const defaultStats = {
      strength: 0, 
      stamina: 0,
      agility: 0,
      endurance: 0,
      mobility: 0,
    };
    // prefer direct prop, else fetch user stats
    const clerkUserId = localStorage.getItem("clerkUserId");
    const fetchServer = async () => {
      if (!stats || Object.keys(stats).length === 0) {
        if (clerkUserId) {
          try {
            const user = await getUserData(clerkUserId);
            const s = user?.stats || null;
            const currentStats = s && Object.keys(s).length > 0 ? s : defaultStats;
            const formattedStats = Object.keys(currentStats).map((key) => ({
              stat: key.charAt(0).toUpperCase() + key.slice(1),
              value: currentStats[key],
            }));
            setChartData({
              labels: formattedStats.map((s) => s.stat),
              datasets: [
                {
                  label: "User Stats",
                  data: formattedStats.map((s) => s.value),
                  backgroundColor: "rgba(0, 198, 255, 0.4)",
                  borderColor: "#00c6ff",
                  borderWidth: 2,
                  pointBackgroundColor: "#00c6ff",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "#00c6ff",
                },
              ],
            });
            return;
          } catch (e) {
            // fallback to default below
          }
        }
      }

      // default behavior (prop or fallback)
      const currentStats = stats && Object.keys(stats).length > 0 ? stats : defaultStats;
      const formattedStats = Object.keys(currentStats).map((key) => ({
        stat: key.charAt(0).toUpperCase() + key.slice(1),
        value: currentStats[key],
      }));
      setChartData({
        labels: formattedStats.map((s) => s.stat),
        datasets: [
          {
            label: "User Stats",
            data: formattedStats.map((s) => s.value),
            backgroundColor: "rgba(0, 198, 255, 0.4)",
            borderColor: "#00c6ff",
            borderWidth: 2,
            pointBackgroundColor: "#00c6ff",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00c6ff",
          },
        ],
      });
    };

    fetchServer();
  }, [stats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderRadius: 10,
      },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(255,255,255,0.2)" },
        grid: { color: "rgba(255,255,255,0.2)" },
        pointLabels: {
          color: "#fff",
          font: { size: 14, weight: "600" },
        },
        ticks: {
          backdropColor: "transparent",
          color: "rgba(255,255,255,0.6)",
          stepSize: 20,
          font: { size: 0, weight: "600" },
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        padding: { xs: "1rem", md: "1.5rem" },
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        width: "100%",
        maxWidth: "500px",
        mx: "auto",
        height: "350px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 0,
          color: "#4178f0ff",
        }}
      >
        User Stats Chart
      </Typography>
      <Box sx={{ flexGrow: 1, position: "relative", }}>
        <RadarJS data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default StatChart;



