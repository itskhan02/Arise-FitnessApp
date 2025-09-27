import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const bodyParts = [
  { id: "Full Body", name: "Full Body", img: "body.png" },
  { id: "Chest", name: "Chest", img: "chest.png" },
  { id: "Back", name: "Back", img: "back.png" },
  { id: "Arms", name: "Arms", img: "arms.png" },
  { id: "Shoulders", name: "Shoulders", img: "shoulder.png" },
  { id: "legs", name: "Legs", img: "leg.png" },
  { id: "Abs", name: "Abs", img: "abs.png" },
];

const FocusArea = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => {
    const savedFocusArea = sessionStorage.getItem("userFocusArea");
    return savedFocusArea ? JSON.parse(savedFocusArea) : [];
  });

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    console.log("Selected parts:", selected);
    const dataToSave = selected.includes("Full Body") ? ["Full Body"] : selected; 
    sessionStorage.setItem("userFocusArea", JSON.stringify(dataToSave)); 
    navigate("/equipment");
  };

  const toggleSelection = (id) => {
    if (id === "Full Body") {
      setSelected((prev) => {
        const updated = prev.includes("Full Body") ? [] : bodyParts.map((p) => p.id);
        sessionStorage.setItem("userFocusArea", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    setSelected((prev) => {
      let next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];

      if (next.length === bodyParts.length - 1 && !next.includes("Full Body")) {
        next.push("Full Body");
      } else if (next.length < bodyParts.length && next.includes("Full Body")) {
        next = next.filter((x) => x !== "Full Body");
      }

      sessionStorage.setItem("userFocusArea", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div
      className="focus-page"
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#00002e",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: 0,
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
          zIndex: 30,
          background: "transparent",
          transition: "transform 0.15s",
        }}
        onClick={handleBack}
        onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(-3px)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
      >
        <MoveLeft size={34} />
      </button>

      <div
        className="focus-text"
        style={{
          position: "absolute",
          top: "4rem",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "2.2rem",
          color: "white",
          zIndex: 20,
        }}
      >
        <h2 style={{ color: "#fff", margin: 0 }}>Select your focus Area</h2>
      </div>

      <div
        className="focus-card"
        tabIndex={0}
        style={{
          position: "absolute",
          top: "8.5rem",
          bottom: "5.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "400px",
          overflowY: "auto",
          padding: "0 1rem",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          zIndex: 10,
        }}
      >
        <div
          className="focus-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.7rem",
            padding: "1rem 0",
            alignItems: "center",
          }}
        >
          {bodyParts.map((part) => (
            <div
              key={part.id}
              onClick={() => toggleSelection(part.id)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                gap: "6rem",
                fontSize: "1.2rem",
                width: "85%",
                height: "5rem",
                cursor: "pointer",
                textAlign: "center",
                border: selected.includes(part.id) ? "1px solid #4caf50" : "1px solid #0505de",
                borderRadius: "0.75rem",
                padding: "1.2rem",
                background: selected.includes(part.id) ? "#16997681" : "#17188baf",
                transition: "all 0.2s ease",
              }}
            >
              <p style={{ color: "#fff", margin: 0 }}>{part.name}</p>
              <img
                src={part.img}
                alt={part.name}
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.opacity = 0.5;
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="action-buttons"
        style={{
          position: "absolute",
          bottom: "1rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 25,
        }}
      >
        <button
          className="btn btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #0bdcf8ff",
            background: "#02013b",
            color: "#fff",
            opacity: selected.length === 0 ? 0.5 : 1,
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
          }}
          onClick={handleNext}
          disabled={selected.length === 0}
        >
          Next <MoveRight />
        </button>
      </div>

      {/* hide webkit scrollbar for .focus-card */}
      <style>{`
        .focus-card::-webkit-scrollbar { width: 0; height: 0; }
        .focus-card { outline: none; }
      `}</style>
    </div>
  );
};

export default FocusArea;
