import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";


const difficulty = [
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

const Difficulty = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [focusAreas, setFocusAreas] = useState([]);

  const { getToken } = useAuth();


  useEffect(() => {
    const savedDifficulty = sessionStorage.getItem("userDifficulty");
    if (savedDifficulty) {
      setSelectedDifficulty(JSON.parse(savedDifficulty));
    }

    const savedGoals = sessionStorage.getItem("userGoal");
    if (savedGoals) setGoals(JSON.parse(savedGoals));

    const savedEquipment = sessionStorage.getItem("userEquipment");
    if (savedEquipment) setSelectedEquipment(JSON.parse(savedEquipment));

    const savedFocusAreas = sessionStorage.getItem("userFocusArea");
    if (savedFocusAreas) setFocusAreas(JSON.parse(savedFocusAreas));
  }, []);

  const selectDifficulty = (key) => {
    setSelectedDifficulty(key);
    sessionStorage.setItem("userDifficulty", JSON.stringify(key));
  };

  const handleBack = () => navigate(-1);

  const handleNext = async () => {
  if (!selectedDifficulty) return;

  // keep sessionStorage (optional but fine)
  sessionStorage.setItem(
    "userDifficulty",
    JSON.stringify(selectedDifficulty)
  );

  // 🔹 Read ALL onboarding data (already saved by previous screens)
  const dob = sessionStorage.getItem("userDOB");
  const age = Number(sessionStorage.getItem("userAge"));
  const gender = sessionStorage.getItem("userGender");
  const heightCm = Number(sessionStorage.getItem("originalHeight"));
  const weightKg = Number(sessionStorage.getItem("userWeight"));
  const difficulty = selectedDifficulty;

  try {
    const token = await getToken();

    await fetch("http://localhost:5000/api/user/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dob,
        age,
        gender,
        heightCm,
        weightKg,
        difficulty,
      }),
    });

    // ✅ Profile saved permanently — now continue
    navigate("/workout-day");
  } catch (err) {
    console.error("Failed to save onboarding profile:", err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div
      className="difficulty-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        justifyContent: "center",
        background: "linear-gradient(180deg, #00002e, #0a0a5a)",
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

      <h2 className="heading" style={{ color: "#fff" }}>
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
            }}
          >
            Selected Equipment:
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
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
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="difficulty-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {difficulty.map((tier) => (
          <div
            key={tier.key}
            onClick={() => selectDifficulty(tier.key)}
            style={{
              cursor: "pointer",
              border:
                selectedDifficulty === tier.key
                  ? "1px solid #8adca6ff"
                  : "1px solid #0505de",
              borderRadius: "1rem",
              padding: "1.2rem 2rem",
              background:
                selectedDifficulty === tier.key ? "#16997681" : "#17188baf",
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
          >
            {tier.name}
            {selectedDifficulty === tier.key && (
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #0bdcf8ff",
            background: "#02013b",
            color: "#fff",
            opacity: !selectedDifficulty ? 0.5 : 1,
            cursor: !selectedDifficulty ? "not-allowed" : "pointer",
          }}
          onClick={handleNext}
          disabled={!selectedDifficulty}
          onMouseOver={(e) => {
            if (!selectedDifficulty) return;
            e.currentTarget.style.background =
              "linear-gradient(90deg, #1e3a8a, #06b6d4)";
            e.currentTarget.style.boxShadow = "0 0 12px #06b6d4";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#02013b";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Next <MoveRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Difficulty;
