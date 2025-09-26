import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const Weight = () => {
  const navigate = useNavigate();

  // DEBUG: Log what's actually in sessionStorage
  useEffect(() => {
    console.log("Saved weight from sessionStorage:", sessionStorage.getItem("userWeight"));
    console.log("Saved unit from sessionStorage:", sessionStorage.getItem("weightUnit"));
    console.log("Saved height from sessionStorage:", sessionStorage.getItem("userHeight"));
  }, []);

  const savedWeight = sessionStorage.getItem("userWeight");
  const savedUnit = sessionStorage.getItem("weightUnit") || "kg";
  const savedHeight = sessionStorage.getItem("userHeight");

  const getInitialWeight = () => {
    if (!savedWeight) return 60;
    
    const parsed = parseFloat(savedWeight);

    if (isNaN(parsed) || parsed < 30 || parsed > 300) {
      console.warn("Invalid weight in sessionStorage, using default");
      return 60;
    }
    
    return parsed;
  };

  const initialWeightKg = getInitialWeight();

  const [unit, setUnit] = useState(savedUnit);
  const [weight, setWeight] = useState(initialWeightKg);

  const heightInMeters = savedHeight ? 
    (parseFloat(savedHeight) > 10 ? parseFloat(savedHeight) / 100 : parseFloat(savedHeight)) : 
    1.7;

  const displayWeight = unit === "kg" 
    ? Math.max(40, Math.min(120, parseFloat(weight.toFixed(1)))) 
    : Math.max(90, Math.min(265, parseFloat((weight * 2.20462).toFixed(1)))); 

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    if (weight < 30 || weight > 300) {
      alert("Please enter a valid weight");
      return;
    }
    
    sessionStorage.setItem("userWeight", weight.toString());
    sessionStorage.setItem("weightUnit", unit);
    navigate("/goal-weight");
  };

  const handleWeightChange = (e) => {
    let newDisplayWeight = parseFloat(e.target.value);
    
    if (unit === "kg") {
      newDisplayWeight = Math.max(40, Math.min(120, newDisplayWeight));
    } else {
      newDisplayWeight = Math.max(90, Math.min(265, newDisplayWeight));
    }

    const newWeightKg = unit === "kg" ? newDisplayWeight : newDisplayWeight / 2.20462;
    
    if (newWeightKg >= 30 && newWeightKg <= 300) {
      setWeight(parseFloat(newWeightKg.toFixed(1)));
    }
  };

  const min = unit === "kg" ? 40 : 90;
  const max = unit === "kg" ? 120 : 265;

  // BMI calculation
  const bmi = weight && heightInMeters ? weight / (heightInMeters * heightInMeters) : 0;
  const formattedBMI = isNaN(bmi) ? "0.0" : Math.max(10, Math.min(50, bmi)).toFixed(1);

  const getBMIMessage = (bmi) => {
    if (bmi < 18.5) return "Underweight - Consider gaining weight";
    if (bmi < 25) return "You've got a great figure! Keep it up!";
    if (bmi < 30) return "Overweight - Consider losing weight";
    return "Obese - Consider weight loss";
  };
  const bmiMessage = getBMIMessage(parseFloat(formattedBMI));

  const originalHeight = sessionStorage.getItem("originalHeight");
  const originalHeightUnit = sessionStorage.getItem("originalHeightUnit");

  // Tick marks
  const generateTicks = () => {
    const ticks = [];
    const numTicks = 8;
    for (let i = 0; i < numTicks; i++) {
      const value = min + ((max - min) * i) / (numTicks - 1);
      ticks.push(unit === "kg" ? Math.round(value) : Math.round(value));
    }
    return ticks;
  };


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
        alignItems: "center",
        justifyContent: "space-around",
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

      <div style={{ textAlign: "center", marginTop: "3.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>
          What's your current weight?
        </h1>
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
          onClick={() => setUnit("kg")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "9999px",
            background: unit === "kg" ? "#fff" : "transparent",
            color: unit === "kg" ? "#000" : "#ccc",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          kg
        </button>
        <button
          onClick={() => setUnit("lbs")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "9999px",
            background: unit === "lbs" ? "#fff" : "transparent",
            color: unit === "lbs" ? "#000" : "#ccc",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          lbs
        </button>
      </div>

      {/* Slider */}
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
        <div style={{ fontSize: "3rem", fontWeight: "300", marginBottom: "1rem" }}>
          {displayWeight}{" "}
          <span style={{ fontSize: "1.5rem", color: "#aaa" }}>{unit}</span>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={displayWeight}
          onChange={handleWeightChange}
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

        {/* Tick Marks */}
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
          {generateTicks().map((tick, i) => (
            <span key={i}>{tick}</span>
          ))}
        </div>
      </div>

      {/* BMI Box */}
      <div
        style={{
          background: "#dbeafe",
          borderRadius: "1rem",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "500",
            marginBottom: "0.5rem",
            color: "#1e3a8a",
          }}
        >
          YOUR CURRENT BMI 💬
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
            color: "#111",
          }}
        >
          {formattedBMI}
        </div>
        <div style={{ textAlign: "center", fontSize: "0.9rem", color: "#555" }}>
          {bmiMessage}
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "0.7rem",
            color: "#888",
            marginTop: "0.5rem",
          }}
        >
          Based on: {weight.toFixed(1)}kg, {heightInMeters.toFixed(2)}m
          {originalHeight && ` (${originalHeight}${originalHeightUnit})`}
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

export default Weight;