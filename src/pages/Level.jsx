import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const levels = [
  { key: "beginner", name: "Beginner" },
  { key: "novice", name: "Novice" },
  { key: "intermediate", name: "Intermediate" },
  { key: "advanced", name: "Advanced" },
];

const Level = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    // Remember selected level from sessionStorage
    const savedLevel = sessionStorage.getItem("userLevel");
    if (savedLevel) {
      setSelectedLevel(JSON.parse(savedLevel));
    }
  }, []);

  const selectLevel = (key) => {
    setSelectedLevel(key);
    sessionStorage.setItem("userLevel", JSON.stringify(key));
  };

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    sessionStorage.setItem("userLevel", JSON.stringify(selectedLevel));
    navigate("/next");
  };

  return (
    <div
      className="level-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        justifyContent: "center",
        background: "#00002e",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "0.8rem",
          left: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          color: "#acaab4ff",
          cursor: "pointer",
          background: "transparent",
          zIndex: 2,
        }}
        onClick={handleBack}
      >
        <MoveLeft size={34} />
      </button>
      <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "600" }}>
        Select Your Training Level
      </h2>
      <div
        className="level-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {levels.map((level) => (
          <div
            key={level.key}
            className={`level-card${selectedLevel === level.key ? " selected" : ""}`}
            style={{
              cursor: "pointer",
              border: selectedLevel === level.key
                ? "1px solid #8adca6ff"
                : "1px solid #0505de",
              borderRadius: "1rem",
              padding: "1.2rem 2rem",
              background: selectedLevel === level.key
                ? "#16997681"
                : "#17188baf",
              color: "#fff",
              width: "320px",
              minHeight: "56px",
              textAlign: "center",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: "500",
              transition: "border 0.2s, background 0.2s",
            }}
            onClick={() => selectLevel(level.key)}
          >
            {level.name}
            {selectedLevel === level.key && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "18px",
                  color: "#fefefeff",
                  fontSize: "1.5rem",
                }}
              >
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
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
            opacity: !selectedLevel ? 0.5 : 1,
            cursor: !selectedLevel ? "not-allowed" : "pointer",
          }}
          onClick={handleNext}
          disabled={!selectedLevel}
        >
          Next <MoveRight size={24} />
        </button>
      </div>
    </div>
  );
};
export default Level;