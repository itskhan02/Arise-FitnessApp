import React from "react";

const Goal = ({ goals }) => {
  if (!goals) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "1rem",
        padding: "1rem 1.5rem",
        boxShadow: "0 0 15px rgba(11, 220, 248, 0.3)",
        marginTop: "1.5rem",
        color: "#fff",
      }}
    >
      <h3
        style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem" }}
      >
        Your Goals / Achievements
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <p>
          Workouts per week: <strong>{goals.workoutsPerWeek}</strong>
        </p>
        <p>
          Total workouts completed: <strong>{goals.totalWorkoutsCompleted}</strong>
        </p>
      </div>
    </div>
  );
};

export default Goal;
