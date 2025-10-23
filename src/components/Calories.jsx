import React, { useEffect, useState } from "react";

const Calories = ({ exercises, userWeight = 70 }) => {
  const [totalCalories, setTotalCalories] = useState(0);

  // If no exercise data passed from props, use some sample data
  const defaultExercises = [
    { name: "Push-ups", met: 8, time: 15 },
    { name: "Running", met: 10, time: 20 },
    { name: "Yoga", met: 4, time: 30 },
  ];

  const activeExercises = exercises && exercises.length > 0 ? exercises : defaultExercises;

  useEffect(() => {
    let total = 0;
    activeExercises.forEach((ex) => {
      // Formula: Calories = MET × weight(kg) × time(hours)
      const calories = ex.met * userWeight * (ex.time / 60);
      total += calories;
    });
    setTotalCalories(total.toFixed(2));
  }, [activeExercises, userWeight]);

  return (
    <div className="calorie-tracker"
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
        }}>
      <h5 style={{ display: "flex", justifyContent: "center", alignItems: "center",flexDirection: "column", gap: "1rem" }}>
        Calories Burned🔥{" "}
        <span style={{ color: "#ff6b81" }}>{totalCalories} kcal</span>
      </h5>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "450px",
    margin: "50px auto",
    padding: "25px",
    borderRadius: "12px",
    background: "#2c2c54",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  listItem: {
    marginBottom: "10px",
    fontSize: "16px",
  },
};

export default Calories;
