import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const Age = () => {
  const navigate = useNavigate();
  const savedAge = sessionStorage.getItem("userAge") || 25;
  const [age, setAge] = useState(parseInt(savedAge));

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    sessionStorage.setItem("userAge", age);
    navigate("/focusarea");
  };

  const handleAgeChange = (e) => {
    setAge(parseInt(e.target.value));
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        background: "#00002e",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
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
          cursor: "pointer",
          background: "transparent",
          transition: "transform 0.15s",
          zIndex: 30,
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(-3px)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
      >
        <MoveLeft size={34} />
      </button>

      <div style={{ textAlign: "center", marginTop: "3.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>What's your age?</h1>
      </div>

      {/*Slider */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "3rem", fontWeight: "300", marginBottom: "1rem" }}>
          {age} <span style={{ fontSize: "1.5rem", color: "#aaa" }}>years</span>
        </div>

        <input
          type="range"
          min={18}
          max={80}
          step={1}
          value={age}
          onChange={handleAgeChange}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "8px",
            borderRadius: "4px",
            background: "#17188baf",
            appearance: "none",
            outline: "none",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#aaa",
          }}
        >
          <span>18</span>
          <span>25</span>
          <span>35</span>
          <span>50</span>
          <span>65</span>
          <span>80</span>
        </div>
      </div>

      {/* Next Button */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleNext}
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
            cursor: "pointer",
          }}
        >
          Next <MoveRight />
        </button>
      </div>
    </div>
  );
};

export default Age;
