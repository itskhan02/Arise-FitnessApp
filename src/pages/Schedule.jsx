import React, { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const days = [
  { key: "sun", name: "Sunday" },
  { key: "mon", name: "Monday" },
  { key: "tue", name: "Tuesday" },
  { key: "wed", name: "Wednesday" },
  { key: "thu", name: "Thursday" },
  { key: "fri", name: "Friday" },
  { key: "sat", name: "Saturday" },
];

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState(() => {
    const savedDays = sessionStorage.getItem("userSchedule");
    return savedDays ? JSON.parse(savedDays) : [];
  });
  const handleBack = () => {
    navigate(-1);
  };

  const toggleDay = (dayKey) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((k) => k !== dayKey)
        : [...prev, dayKey]
    );
  };

  const handleNext = () => {
    if (selectedDays.length > 0) {
      sessionStorage.setItem("userSchedule", JSON.stringify(selectedDays));
      navigate("/setup");
    }
  };

  return (
    <>
      <div
        className="workoutday-page"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#00002e",
          boxShadow: "0 0 30px 5px #3a1c71 inset",
          overflow: "hidden",
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
        <h2  className="heading" 
          style={{
            color: "#fff",
            marginBottom: "2rem",
            position:"fixed",
            top:"4rem",
          }}
        >
          Set Your Weekly Routine
        </h2>
        <div
          className="days-grid"
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "1rem",
            marginTop: "6rem",
            position: "relative",
            flexWrap: "wrap",
          }}
        >
          {days.map((day) => (
            <div
              key={day.key}
              className={`level-card${
                selectedDays.includes(day.key) ? " selected" : ""
              }`}
              style={{
                cursor: "pointer",
                border:
                  selectedDays.includes(day.key)
                    ? "1px solid #8adca6ff"
                    : "1px solid #0505de",
                borderRadius: "1rem",
                padding: "1.2rem 2rem",
                background:
                  selectedDays.includes(day.key) ? "#16997681" : "#17188baf",
                color: "#fff",
                width: "180px",
                minHeight: "2rem",
                textAlign: "center",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                fontWeight: "500",
                transition: "border 0.2s, background 0.2s",
              }}
              onClick={() => toggleDay(day.key)}
            >
              {day.name}
              {selectedDays.includes(day.key) && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "18px",
                    color: "#fefefeff",
                    fontSize: "1.5rem",
                  }}
                >
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
              gap: "1rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #0bdcf8ff ",
              background: "#02013b",
              color: "#fff",
              marginTop: "2rem",
              opacity: selectedDays.length === 0 ? 0.5 : 1,
              cursor: selectedDays.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={handleNext}
            disabled={selectedDays.length === 0}
          >
            Next <MoveRight size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Schedule;
