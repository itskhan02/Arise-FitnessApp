import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";
import { motion } from "framer-motion";

const Age = () => {
  const navigate = useNavigate();

  // Load saved DOB from sessionStorage or default
  const savedDOB = sessionStorage.getItem("userDOB") || "2002-12-15";
  const initialAge = sessionStorage.getItem("userAge") || 22;

  const [dob, setDob] = useState(savedDOB);
  const [age, setAge] = useState(parseInt(initialAge));

  const handleBack = () => navigate(-1);

  // Update age in sessionStorage and navigate next
  const handleNext = () => {
    sessionStorage.setItem("userDOB", dob);
    sessionStorage.setItem("userAge", age);
    navigate("/focusarea");
  };

  // Calculate age from DOB
  const calculateAgeFromDOB = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Update age whenever DOB changes
  useEffect(() => {
    setAge(calculateAgeFromDOB(dob));
  }, [dob]);

  const handleAgeChange = (e) => {
    const newAge = parseInt(e.target.value);
    setAge(newAge);

    // Update DOB based on new age, assuming birthday already passed this year
    const today = new Date();
    const birthYear = today.getFullYear() - newAge;
    const birthMonthDay = new Date(dob);
    birthMonthDay.setFullYear(birthYear);
    setDob(birthMonthDay.toISOString().split("T")[0]);
  };

  const handleDOBChange = (e) => setDob(e.target.value);

  const minAge = 12;
  const maxAge = 70;
  const tickStep = 7;
  const ticks = [];
  for (let i = minAge; i < maxAge; i += tickStep) ticks.push(i);
  ticks.push(maxAge);

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        background: "linear-gradient(180deg, #00002e, #0a0a5a)",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "hidden",
        justifyContent: "space-evenly",
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
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <MoveLeft size={34} />
      </button>

      <div style={{ textAlign: "center" }}>
        <h1 className="heading" style={{ color: "#fff", margin: 0 }}>What's your age?</h1>
        <p style={{ color: "#9e9d9dff", marginTop: "0.5rem" }}>
          Don’t worry, we won’t tell anyone 😄
        </p>
      </div>

        {/* DOB  */}
        <input
          type="date"
          value={dob}
          onChange={handleDOBChange}
          className="dob-input"
          style={{
            width: "10.5rem",
            maxWidth: "430px",
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #06b6d4",
            background: "transparent",
            color: "#fff",
            outline: "none",
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "1rem",
          }}
        />


      {/* Slider Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "25%",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {/* Age Display */}
        <motion.div
          key={age}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: "400",
            marginBottom: "1rem",
          }}
        >
          {age} <span style={{ fontSize: "1.5rem", color: "#aaa" }}>years</span>
        </motion.div>

        {/* Slider */}
        <input
          type="range"
          min={minAge}
          max={maxAge}
          step={1}
          value={age}
          onChange={handleAgeChange}
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

        {/* Ticks */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            maxWidth: "430px",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#aaa",
          }}
        >
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div style={{display: "flex", justifyContent: "center" }}>
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
            transition: "all 0.3s ease",
            position: "absolute",
            bottom: "3rem",
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

export default Age;
