import React, { useEffect, useState } from "react";
import { HiMiniFire } from "react-icons/hi2";

const TOTAL_KEY = "totalCalories";
const HISTORY_KEY = "calorieHistory";

const Calories = ({ userWeight = 70 }) => {
  const [totalCalories, setTotalCalories] = useState(() => {
    const saved = localStorage.getItem(TOTAL_KEY);
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    // Handler for custom event dispatched from ExerciseList
    const handleCaloriesUpdate = (event) => {
      const { caloriesBurned, newTotal } = event.detail || {};
      if (typeof newTotal === "number") {
        setTotalCalories(newTotal);
      } else if (typeof caloriesBurned === "number") {
        // fallback: read from storage
        const saved = parseFloat(localStorage.getItem(TOTAL_KEY)) || 0;
        setTotalCalories(saved);
      }
    };

    // Handler for storage events (keeps multiple tabs/windows in sync)
    const handleStorage = (e) => {
      if (!e.key) return;
      if (e.key === TOTAL_KEY) {
        const val = e.newValue ? parseFloat(e.newValue) : 0;
        setTotalCalories(val);
      }
    };

    window.addEventListener("caloriesUpdated", handleCaloriesUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("caloriesUpdated", handleCaloriesUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <div
      className="calorie-tracker"
      style={{
        maxWidth: 500,
        margin: "0",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        borderRadius: 20,
        padding: "1rem",
        color: "#fff",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        lineHeight: "2",
      }}
    >
      <h5
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          color: "#4178f0ff",
          fontWeight: "600",
          fontSize: "1.4rem",
        }}
      >
        Calories Burned <HiMiniFire size={26} color="rgb(220, 143, 65)" />{" "}
      </h5>
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#f56a37ff",
        }}
      >
        {Number.isFinite(totalCalories) ? totalCalories.toFixed(0) : "0"} kcal
      </span>
    </div>
  );
};

export default Calories;
