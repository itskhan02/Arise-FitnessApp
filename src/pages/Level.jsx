import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const levels = [
  { key: "beginner", name: "Beginner" },
  { key: "intermediate", name: "Intermediate" },
  { key: "advanced", name: "Advanced" },
];

const equipmentOptions = [
  { key: "Full Gym", name: "Full Gym" },
  { key: "Garage Gym", name: "Garage Gym" },
  { key: "Dumbbell Only", name: "Dumbbell Only" },
  { key: "At Home", name: "At Home" },
];

const Level = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [focusAreas, setFocusAreas] = useState([]); // Add state for focus areas

  useEffect(() => {
    // Remember selected level from sessionStorage
    const savedLevel = sessionStorage.getItem("userLevel");
    if (savedLevel) {
      setSelectedLevel(JSON.parse(savedLevel));
    }
    // Load selected goals from sessionStorage
    const savedGoals = sessionStorage.getItem("userGoal");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    // Load selected equipment from sessionStorage
    const savedEquipment = sessionStorage.getItem("userEquipment");
    if (savedEquipment) {
      setSelectedEquipment(JSON.parse(savedEquipment));
    }
    // Load selected focus areas from sessionStorage
    const savedFocusAreas = sessionStorage.getItem("userFocusArea"); // Retrieve focus areas
    if (savedFocusAreas) {
      setFocusAreas(JSON.parse(savedFocusAreas));
    }
  }, []);

  const selectLevel = (key) => {
    setSelectedLevel(key);
    sessionStorage.setItem("userLevel", JSON.stringify(key));
  };

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    sessionStorage.setItem("userLevel", JSON.stringify(selectedLevel));
    navigate("/workout-day");
  };

  return (
    <div
      className="level-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        justifyContent: "center",
        background: "#00002e",
        boxShadow: "0 0 30px 5px #3a1c71 inset",
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
      
      <h2 className="heading" style={{ color: "#fff", }}>
        Select Your Training Level
      </h2>

      {goals.length > 0 && (
        <div
          style={{
            color: "#8adca6ff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "650px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "0.5rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            Selected Goals:
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
              width: "100%",
              maxWidth: "650px",
            }}
          >
            {goals.map((goal) => (
              <span
                key={goal.key}
                style={{
                  background: "#16997681",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.3rem 1rem",
                  fontWeight: "500",
                  fontSize: "1rem",
                  boxShadow: "0 0 4px #8adca6ff",
                  textAlign: "center",
                  minWidth: "120px",
                  display: "inline-block",
                }}
              >
                {goal.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedEquipment && (
        <div
          style={{
            color: "#8adca6ff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "650px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "0.5rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            Selected Equipment:
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              maxWidth: "650px",
            }}
          >
            <span
              style={{
                background: "#16997681",
                color: "#fff",
                borderRadius: "0.5rem",
                padding: "0.3rem 1rem",
                fontWeight: "500",
                fontSize: "1rem",
                boxShadow: "0 0 4px #8adca6ff",
                textAlign: "center",
                minWidth: "120px",
                display: "inline-block",
              }}
            >
              {
                equipmentOptions.find(
                  (eq) => eq.key === selectedEquipment
                )?.name || selectedEquipment
              }
            </span>
          </div>
        </div>
      )}

      {focusAreas.length > 0 && (
        <div
          style={{
            color: "#8adca6ff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "650px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "0.5rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            Selected Focus Areas:
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
              width: "100%",
              maxWidth: "650px",
            }}
          >
            {focusAreas.map((area) => (
              <span
                key={area}
                style={{
                  background: "#16997681",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.3rem 1rem",
                  fontWeight: "500",
                  fontSize: "1rem",
                  boxShadow: "0 0 4px #8adca6ff",
                  textAlign: "center",
                  minWidth: "120px",
                  display: "inline-block",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

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
            className={`level-card${
              selectedLevel === level.key ? " selected" : ""
            }`}
            style={{
              cursor: "pointer",
              border:
                selectedLevel === level.key
                  ? "1px solid #8adca6ff"
                  : "1px solid #0505de",
              borderRadius: "1rem",
              padding: "1.2rem 2rem",
              background:
                selectedLevel === level.key ? "#16997681" : "#17188baf",
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
            gap: "0.8rem",
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
