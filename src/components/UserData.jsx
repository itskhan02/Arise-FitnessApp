import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const UserData = () => {
  const location = useLocation();
  const { user } = useUser();

  const [details, setDetails] = useState({
    fullName: "",
    dob: "2000-01-01",
    age: 0,
    height: 170,
    weight: 65,
    tier: "Beginner",
    customImage: "",
    gender: "",
  });

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
        {["Age", "Height", "Weight", "Tier"].map((field) => (
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
                  : field === "Weight"
                  ? details.weight
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
      </div>
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
