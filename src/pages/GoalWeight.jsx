import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const GoalWeight = () => {
  const navigate = useNavigate();

  // Load saved weight and target from sessionStorage
  const savedCurrentWeight = sessionStorage.getItem("userWeight") || 60;
  const savedTargetWeight = sessionStorage.getItem("targetWeight") || savedCurrentWeight;

  const [unit, setUnit] = useState("kg");
  const [targetWeight, setTargetWeight] = useState(() => parseFloat(savedTargetWeight));

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    const targetInKg = unit === "kg" ? targetWeight : targetWeight / 2.20462;
    sessionStorage.setItem("targetWeight", targetInKg);
    sessionStorage.setItem("weightUnit", unit);
    navigate("/age"); // Change route as needed
  };

  const handleTargetWeightChange = (e) => setTargetWeight(parseFloat(e.target.value));

  const handleUnitChange = (newUnit) => {
    if (unit === newUnit) return;
    if (newUnit === "lbs") {
      setTargetWeight((prevKg) => parseFloat((prevKg * 2.20462).toFixed(1)));
    } else {
      setTargetWeight((prevLbs) => parseFloat((prevLbs / 2.20462).toFixed(1)));
    }
    setUnit(newUnit);
  };

  const currentWeight = parseFloat(savedCurrentWeight);
  const weightLossPercentage = Math.max(
    ((currentWeight - (unit === "kg" ? targetWeight : targetWeight / 2.20462)) / currentWeight) * 100,
    0
  ).toFixed(1);

  const min = unit === "kg" ? 40 : 80;
  const max = unit === "kg" ? 120 : 260;

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        background: "#00002e",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          color: "#acaab4ff",
          cursor: "pointer",
          background: "transparent",
          transition: "transform 0.15s",
          zIndex: 30,
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(-3px)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
      >
        <MoveLeft size={34} />
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginTop: "3.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>What's your target weight?</h1>
      </div>

      {/* Unit Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
          background: "#17188baf",
          borderRadius: "9999px",
          padding: "0.25rem",
        }}
      >
        <button
          onClick={() => handleUnitChange("kg")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "9999px",
            background: unit === "kg" ? "#fff" : "transparent",
            color: unit === "kg" ? "#000" : "#ccc",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          kg
        </button>
        <button
          onClick={() => handleUnitChange("lbs")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "9999px",
            background: unit === "lbs" ? "#fff" : "transparent",
            color: unit === "lbs" ? "#000" : "#ccc",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          lbs
        </button>
      </div>

      {/* Slider Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {/* Current Weight */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.25rem" }}>Current</div>
          <div style={{ fontSize: "1.2rem", color: "#ccc" }}>{currentWeight} kg</div>
        </div>

        {/* Target Weight Display */}
        <div style={{ fontSize: "3rem", fontWeight: "300", marginBottom: "1rem" }}>
          {targetWeight} <span style={{ fontSize: "1.5rem", color: "#aaa" }}>{unit}</span>
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={targetWeight}
          onChange={handleTargetWeightChange}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "8px",
            borderRadius: "4px",
            background: "#17188baf",
            appearance: "none",
            outline: "none",
            cursor: "pointer",
          }}
        />

        {/* Slider Number Line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#aaa",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => {
            const tick = min + ((max - min) / 8) * i; // 8 intervals = 9 ticks
            return <span key={i}>{tick.toFixed(0)}</span>;
          })}
        </div>
      </div>

      {/* Info Section */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            textAlign: "center",
            fontWeight: "600",
            color: "#16a34a",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
          }}
        >
          REASONABLE TARGET!
        </div>
        <div style={{ textAlign: "center", color: "#ccc", marginBottom: "0.5rem" }}>
          You will lose {weightLossPercentage}% of body weight
        </div>
        <div style={{ background: "#dcfce7", borderRadius: "1rem", padding: "1rem" }}>
          <p style={{ color: "#166534", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            Moderate weight loss can also make a big difference:
          </p>
          <ul style={{ color: "#15803d", fontSize: "0.85rem", margin: 0, paddingLeft: "1rem" }}>
            <li style={{ marginBottom: "0.25rem" }}>✓ Lower blood pressure</li>
            <li>✓ Reduce the risk of type 2 diabetes</li>
          </ul>
        </div>
      </div>

      {/* Next Button */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleNext}
          className="btn btn-primary"
            style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #0bdcf8ff ",
            background: "#02013b",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Next <MoveRight />
        </button>
      </div>
    </div>
  );
};

export default GoalWeight;
