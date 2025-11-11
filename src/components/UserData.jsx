import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { X } from "lucide-react";

const UserData = () => {
  const location = useLocation();
  const { user } = useUser();

  const [details, setDetails] = useState({
    fullName: "",
    dob: "2000-01-01",
    age: "",
    height: "",
    weight:"",
    tier: "Beginner",
    customImage: "",
    gender: "",
  });

  const [isWeightPopupOpen, setIsWeightPopupOpen] = useState(false);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    if (user) {
      const savedDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
      
      let difficulty = "beginner";
      try {
        const storedDifficulty = sessionStorage.getItem("userDifficulty");
        if (storedDifficulty) {
          difficulty = JSON.parse(storedDifficulty);
        }
      } catch (e) { /* Ignore parsing errors, fallback to default */ }
      const difficultyName = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

      setDetails({
        fullName: user.fullName || "",
        dob: savedDetails.dob || sessionStorage.getItem("userDOB") || "2000-01-01",
        age: calculateAge(savedDetails.dob || sessionStorage.getItem("userDOB") || "2000-01-01"),
        height: Math.round(parseFloat(sessionStorage.getItem("originalHeight"))) || 170,
        weight: parseFloat(sessionStorage.getItem("userWeight")) || 65,
        tier: difficultyName,
        gender: sessionStorage.getItem("userGender") || "",
      });
    }
  }, [user]);

  const handleWeightChange = (e) => {
    const newWeight = e.target.value;
    setDetails(prev => ({ ...prev, weight: newWeight }));
    sessionStorage.setItem("userWeight", newWeight);
    // Also update the consolidated details object if it exists
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
    sessionStorage.setItem("userDetails", JSON.stringify({ ...userDetails, weight: newWeight }));
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        width: "85%",
        maxWidth: "400px",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        borderRadius: 20,
        padding: "1rem 1.5rem",
        color: "#fff",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        marginBottom: "6rem",
      }}
    >
      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: "600",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Personal Details
      </h3>
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label>DOB</label>
          <input
            type="date"
            value={details.dob}
            onChange={() => {}}
            style={{
              width: "50%",
              padding: "0.5rem",
              boxSizing: "border-box",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              outline: "none",
              fontSize: "0.95rem",
              background: "transparent",
            }}
          />
        </div>
        {["Age", "Height", "Tier"].map((field) => (
          <div
            key={field}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>{field}</label>
            <input
              type="text"
              value={
                field === "Age"
                  ? details.age
                  : field === "Height"
                  ? details.height
                  : details.tier
              }
              disabled
              style={{
                width: "50%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                outline: "none",
                fontSize: "0.95rem",
                background: "transparent",
              }}
            />
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label>Weight</label>
          <button
            onClick={() => setIsWeightPopupOpen(true)}
            style={{
              width: "50%",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              outline: "none",
              fontSize: "0.95rem",
              background: "transparent",
              cursor: "pointer",
              textAlign: "start",
            }}
          >
            {details.weight} kg
          </button>
        </div>
      </div>

      {/* Weight Slider Popup */}
      {isWeightPopupOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsWeightPopupOpen(false)}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #0f172a, #030712)",
              padding: "1.5rem",
              borderRadius: 20,
              width: "90%",
              maxWidth: "350px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
              position: "relative",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#94a3b8" }}>
              Select Weight: {details.weight} kg
            </h3>
            <input
              type="range"
              min="30"
              max="200"
              step="0.5"
              value={details.weight}
              onChange={handleWeightChange}
              style={{ width: "100%", cursor: "pointer" }}
            />
            <button onClick={() => setIsWeightPopupOpen(false)} style={{marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #0bdcf8ff", background: "#02013b", color: "#fff", cursor: "pointer"}}>Done</button>
          </div>
        </div>
      )}

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);              
          font-size: 1.2rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default UserData;
