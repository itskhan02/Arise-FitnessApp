import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";
import { motion } from "framer-motion";

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
    navigate("/age");
  };

  const handleTargetWeightChange = (e) => setTargetWeight(parseFloat(e.target.value));

  const handleUnitChange = (newUnit) => {
    if (unit === newUnit) return;
    if (newUnit === "lbs") {
      setTargetWeight((prevKg) => parseFloat((prevKg * 2.20462).toFixed(2)));
    } else {
      setTargetWeight((prevLbs) => parseFloat((prevLbs / 2.20462).toFixed(2)));
    }
    setUnit(newUnit);
  };

  const currentWeight = parseFloat(savedCurrentWeight);
  const targetInKg = unit === "kg" ? targetWeight : targetWeight / 2.20462;
  const weightGain = currentWeight - targetInKg;
  const weightChangePercentage = ((weightGain / currentWeight) * 100);
  const weightLossPercentage = Math.max(0, weightChangePercentage).toFixed(1);

  const min = unit === "kg" ? 40 : 80;
  const max = unit === "kg" ? 120 : 260;


  let healthTitle = "";
  let healthMessage = "";
  let tips = [];
  let bgColor = "#dcfce7";
  let textColor = "#166534";

  if (Math.abs(weightGain) > 22) {
    healthTitle = "Extreme Target Warning ⚠️";
    healthMessage = `A goal of changing your weight by more than 30 kg (${(30 * 2.20462).toFixed(0)} lbs) is very ambitious and can be risky.`;
    tips = [
      "✓ We strongly recommend consulting a doctor or nutritionist.",
      "✓ Please consider setting a more gradual, intermediate goal first.",
      "✓ Rapid weight changes can negatively impact your health and metabolism.",
    ];
    bgColor = "#fee2e2";
    textColor = "#991b1b";
  }
  else if (weightChangePercentage <= 0) {
    healthTitle = "Maintain Your Balance 🌿";
    healthMessage = "You’re already in a stable range — keep nurturing your current lifestyle!";
    tips = [
      "✓ Stay consistent with daily movement and stretching",
      "✓ Prioritize 7–8 hours of sleep and hydration",
      "✓ Keep your diet colorful — more greens, fewer processed foods",
    ];
    bgColor = "#e0f2fe";
    textColor = "#065a9bff";
  } else if (weightChangePercentage <= 5) {
    healthTitle = "Small Wins, Big Impact 🌟";
    healthMessage = "Even modest weight loss can lead to remarkable health improvements.";
    tips = [
      "✓ Slightly reduce sugar and refined carbs",
      "✓ Walk 8–10k steps or do 30 mins of light cardio daily",
      "✓ Focus on portion control and mindful eating",
      "✓ Notice better sleep and energy within weeks!",
    ];
    bgColor = "#dcfce7";
    textColor = "#02a23fff";
  } else if (weightChangePercentage <= 10) {
    healthTitle = "Strong, Realistic Goal 💪";
    healthMessage =
      "This range helps improve fitness, metabolism, and long-term health when done gradually.";
    tips = [
      "✓ Combine strength training with moderate cardio 3–4 times/week",
      "✓ Ensure high-protein meals (lentils, eggs, lean meat)",
      "✓ Track your progress weekly — not daily!",
      "✓ Stay hydrated and avoid crash diets",
    ];
    bgColor = "#fef9c3";
    textColor = "#854d0e";
  } else if (weightChangePercentage <= 20) {
    healthTitle = "Ambitious Target 🔥";
    healthMessage =
      "You’re aiming high — stay disciplined but ensure a safe, sustainable pace of weight loss.";
    tips = [
      "✓ Aim for 0.5–1 kg per week; rapid loss can affect metabolism",
      "✓ Add HIIT or circuit training for faster results",
      "✓ Eat fiber-rich foods to stay full longer",
      "✓ Consult a trainer or nutritionist for a custom plan",
    ];
    bgColor = "#fde68a";
    textColor = "#92400e";
  } else {
    healthTitle = "Be Cautious 🚨";
    healthMessage =
      "A target beyond 20% may strain your body. Consider smaller milestones and medical guidance.";
    tips = [
      "✓ Break your goal into 5–10% phases",
      "✓ Focus on muscle preservation with strength workouts",
      "✓ Include healthy fats (avocados, nuts, olive oil)",
      "✓ Consult a doctor before major dietary changes",
    ];
    bgColor = "#fee2e2";
    textColor = "#991b1b";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(180deg, #00002e, #0a0a5a)",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "2rem",
        boxSizing: "border-box",
        overflowY: "auto",
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
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2 className="heading" style={{ color: "#fff", margin: 0 }}>What's your target weight?</h2>
      </div>

      {/* Unit Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          background: "#17188baf",
          borderRadius: "9999px",
          padding: "0.25rem",
          width: "200px",
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
          width: "100%",          
          justifyContent: "center",
          color: "#fff",
          maxWidth: "450px",
        }}
      >
      
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.25rem" }}>Current</div>
          <div style={{ fontSize: "1.2rem", color: "#ccc" }}>{Math.round(currentWeight)} kg</div>
        </div>

        {/* <div style={{ fontSize: "2.5rem", fontWeight: "300", marginBottom: "1rem" }}>
          {targetWeight.toFixed(2)} <span style={{ fontSize: "1.5rem", color: "#aaa" }}>{unit}</span>
        </div> */}
          <motion.div
          key={targetWeight}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: "2.5rem", fontWeight: "400", marginBottom: "1rem" }}
        >
          {targetWeight} <span style={{ fontSize: "1.5rem", color: "#aaa" }}>{unit}</span>
        </motion.div>

        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={targetWeight}
          onChange={handleTargetWeightChange}
          style={{
            width: "90%",
            maxWidth: "430px",
            height: "8px",
            borderRadius: "4px",
            background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
            appearance: "none",
            outline: "none",
            cursor: "pointer",
            boxShadow: "0 0 8px #06b6d4",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#aaa",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => {
            const tick = min + ((max - min) / 8) * i;
            return <span key={i}>{tick.toFixed(0)}</span>;
          })}
        </div>
      </div>

      <div  className="tip-box"  style={{ marginBottom: "1rem",}}>
        <div
          style={{
            textAlign: "center",
            fontWeight: "600",
            color: textColor,
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
          }}
        >
          {healthTitle}
        </div>

        <div style={{ background: bgColor, borderRadius: "1rem", padding: "1rem" }}>
          <p style={{ color: textColor, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            {healthMessage}
          </p>
          <ul style={{ color: textColor, fontSize: "0.85rem", margin: 0, paddingLeft: "1rem" }}>
            {tips.map((tip, index) => (
              <li key={index} style={{ marginBottom: "0.25rem" }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Button */}
      <div style={{ marginTop: "auto", paddingBottom: "1rem" }}>
        <button
          onClick={handleNext}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #0bdcf8ff",
            background: "#02013b",
            color: "#fff",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(90deg, #1e3a8a, #06b6d4)";
            e.currentTarget.style.boxShadow = "0 0 12px #06b6d4";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#02013b";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Next <MoveRight />
        </button>
      </div>
    </div>
  );
};

export default GoalWeight;
