import React from "react";
import { useNavigate } from "react-router-dom";

const WorkoutDay = () => {
  const navigate = useNavigate();

  const workoutsByDay = {
    monday: "Chest",
    tuesday: "Back",
    wednesday: "Legs",
    thursday: "Shoulders",
    friday: "Arms",
    saturday: "Core / Cardio",
    sunday: "Rest",
  };

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const todayName = dayNames[new Date().getDay()];
  const todayWorkout = workoutsByDay[todayName];

  const handleStartWorkout = () => {
    if (todayWorkout.toLowerCase() === "rest") return;
    navigate("/exercises", { state: { workoutType: todayWorkout } });
  };

  return (
    <div
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
    >
      <h3 style={{ 
                color: "#775acdff",
                fontWeight: "600",
                fontSize: "1.4rem", 
                }}
                >
                Today's Workout
                </h3>
      <ul style={{ padding: 0, display: "flex", flexDirection: "row",justifyContent: "space-between",alignItems: "center", gap: "1rem" }}>
        <li
          key={todayName}
          style={{
            fontWeight: "600",
            listStyleType: "none",
            fontSize: "1.3rem",
            textTransform: "capitalize",
          }}
        >
          {todayName} — {todayWorkout}
        </li>
        {todayWorkout.toLowerCase() !== "rest" ? (
        <button
          onClick={handleStartWorkout}
          style={{
            background:
              "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "10px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Start
        </button>
      ) : (
        <p style={{ opacity: 0.7 }}>Rest Day 😴</p>
      )}
      </ul>
    </div>
  );
};

export default WorkoutDay;
