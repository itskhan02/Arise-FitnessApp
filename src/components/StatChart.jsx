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
    const data =
      stats && stats.length > 0
        ? stats
        : [
            { stat: "Strength", value: 5 },
            { stat: "Stamina", value: 6 },
            { stat: "Agility", value: 7 },
            { stat: "Endurance", value: 4 },
            { stat: "Mobility", value: 3 },
          ];

    setChartData({
      labels: data.map((s) => s.stat),
      datasets: [
        {
          label: "User Stats",
          data: data.map((s) => s.value),
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
          stepSize: 10,
          font: { size: 12, weight: "600" },
        },
        min: 0,
        max: 50,
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
        maxWidth: "448px",
        mx: "auto",
        height: "450px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 2,
          color: "#a78bfa",
        }}
      >
        User Stats Chart
      </Typography>
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <RadarJS data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default StatChart;
