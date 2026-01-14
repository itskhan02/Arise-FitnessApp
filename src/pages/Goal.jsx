import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const categories = [
  { name: "Bodybuilding", key: "b" },
  { name: "Muscle & Sculpting", key: "m" },
  { name: "Powerbuilding", key: "p" },
  { name: "Athletics", key: "a" },
  { name: "Powerlifting", key: "l" },
  { name: "Bodyweight Fitness", key: "f" },
  { name: "Olympic Weightlifting", key: "o" },
  { name: "At-Home & Calisthenics", key: "c" },
];

const Goal = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const savedGoal = sessionStorage.getItem("userGoal");
    if (savedGoal) {
      setSelectedCategories(JSON.parse(savedGoal));
    }
  }, []);

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    if (selectedCategories.length > 0) {
      sessionStorage.setItem("userGoal", JSON.stringify(selectedCategories));
      navigate("/Equipment");
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.key === category.key)
        ? prev.filter((c) => c.key !== category.key)
        : [...prev, category]
    );
  };

  return (
    <div
      className="goal-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        justifyContent: "center",
        background: "linear-gradient(180deg, #00002e, #0a0a5a)",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        overflow: "hidden",
        position: "relative",
        padding: "2rem 1rem",
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

      <h2 className="heading" style={{ color: "#fff", fontSize: "1.8rem", }}>
        Choose Your Goal
      </h2>

      <div
        className="goal-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "flex-start",
          maxHeight: "400px", 
          overflowY: "auto", 
          paddingRight: "0.5rem",
          width: "100%",
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategories.some(
            (c) => c.key === category.key
          );
          return (
            <div
              key={category.key}
              className={`goal-card${isSelected ? " selected" : ""}`}
              style={{
                cursor: "pointer",
                border: isSelected
                  ? "1px solid #8adca6ff"
                  : "1px solid #0505de",
                borderRadius: "1rem",
                padding: "1.2rem 2rem",
                background: isSelected ? "#16997681" : "#17188baf",
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
              onClick={() => toggleCategory(category)}
            >
              {category.name}
              {isSelected && (
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
          );
        })}
      </div>

      {/* Next Button */}
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
            opacity: selectedCategories.length === 0 ? 0.5 : 1,
            cursor:
              selectedCategories.length === 0 ? "not-allowed" : "pointer",
          }}
          onClick={handleNext}
          disabled={selectedCategories.length === 0}
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
          Next <MoveRight size={24} />
        </button>
      </div>

      {/* Hide scrollbar but keep scroll */}
      <style>
        {`
          .goal-list::-webkit-scrollbar {
            width: 6px;
          }
          .goal-list::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 10px;
          }
          .goal-list::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default Goal;
