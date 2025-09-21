import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const equipmentOptions = [
  { key: "Full Gym", name: "Full Gym" },
  { key: "Garage Gym", name: "Garage Gym" },
  { key: "Dumbbell Only", name: "Dumbbell Only" },
  { key: "At Home", name: "At Home" },
];

const Equipment = () => {
  const navigate = useNavigate();
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Remember selected equipment from sessionStorage
    const savedEquipment = sessionStorage.getItem("userEquipment");
    if (savedEquipment) {
      setSelectedEquipment(JSON.parse(savedEquipment));
    }
    const savedGoals = sessionStorage.getItem("userGoal");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const selectEquipment = (key) => {
    setSelectedEquipment(key);
    sessionStorage.setItem("userEquipment", JSON.stringify(key));
  };

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    sessionStorage.setItem("userEquipment", JSON.stringify(selectedEquipment));
    navigate("/level");
  };

  return (
    <div
      className="equipment-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
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
      <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "600" }}>
        Select Your Equipment
      </h2>
      {goals.length > 0 && (
        <div
          style={{
            color: "#8adca6ff",
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "650px",
          }}
        >
          <span style={{ fontWeight: "bold", color: "#fff", marginBottom: "0.5rem", textAlign: "center", width: "100%" }}>
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
      <div
        className="equipment-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {equipmentOptions.map((eq) => (
          <div
            key={eq.key}
            className={`equipment-card${selectedEquipment === eq.key ? " selected" : ""}`}
            style={{
              cursor: "pointer",
              border: selectedEquipment === eq.key
                ? "1px solid #8adca6ff"
                : "1px solid #0505de",
              borderRadius: "1rem",
              padding: "1.2rem 2rem",
              background: selectedEquipment === eq.key
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
            onClick={() => selectEquipment(eq.key)}
          >
            {eq.name}
            {selectedEquipment === eq.key && (
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
            opacity: !selectedEquipment ? 0.5 : 1,
            cursor: !selectedEquipment ? "not-allowed" : "pointer",
          }}
          onClick={handleNext}
          disabled={!selectedEquipment}
        >
          Next <MoveRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Equipment;