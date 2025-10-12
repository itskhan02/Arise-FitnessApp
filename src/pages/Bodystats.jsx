import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Ruler, Weight, Calendar, MoveRight, MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Bodystats = () => {
  const [height, setHeight] = useState(() => Number(sessionStorage.getItem("height")) || 170);
  const [weight, setWeight] = useState(() => Number(sessionStorage.getItem("weight")) || 65);
  const [age, setAge] = useState(() => Number(sessionStorage.getItem("age")) || 25);
  const [heightUnit, setHeightUnit] = useState("cm");

  useEffect(() => {
    sessionStorage.setItem("height", height);
    sessionStorage.setItem("weight", weight);
    sessionStorage.setItem("age", age);
  }, [height, weight, age]);

  const navigate = useNavigate();
  const handleNext = () => navigate("/focusarea");
  const handleBack = () => navigate(-1);

  // Convert cm <-> ft/in
  const convertHeight = (value, toUnit) => {
    if (toUnit === "feet") {
      const totalInches = value / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return { feet, inches };
    } else {
      const { feet, inches } = value;
      return Math.round((feet * 12 + inches) * 2.54);
    }
  };

  // Marks for sliders
  const heightMarks = Array.from({ length: 16 }, (_, i) => {
    const value = 100 + i * 10;
    return { value, label: value % 20 === 0 ? `${value}` : "" };
  });
  const weightMarks = Array.from({ length: 18 }, (_, i) => {
    const value = 30 + i * 10;
    return { value, label: value % 50 === 0 ? `${value}` : "" };
  });
  const ageMarks = Array.from({ length: 10 }, (_, i) => {
    const value = 10 + i * 10;
    return { value, label: value % 20 === 0 || value === 10 ? `${value}` : "" };
  });

  const sliderStyles = {
    color: "#6365f125",
    height: 3,
    "& .MuiSlider-track": { border: "none" },
    "& .MuiSlider-thumb": {
      height: 22,
      width: 8,
      bgcolor: "#0c65f5ff",
      border: "2px solid #6365f10a",
      "&:hover, &.Mui-focusVisible": {
        boxShadow: "0px 0px 0px 8px rgba(99,102,241,0.2)",
      },
      "&:before": { display: "none" },
    },
    "& .MuiSlider-mark": {
      height: 16,
      width: 2,
      bgcolor: "rgba(250, 250, 250, 1)",
      opacity: 0.6,
      "&.MuiSlider-markActive": { bgcolor: "#c9e0e9ff", opacity: 1 },
    },
    "& .MuiSlider-markLabel": {
      fontSize: "0.7rem",
      color: "rgba(255, 255, 255, 1)",
    },
    "& .MuiSlider-rail": { opacity: 0.3, bgcolor: "rgba(255, 255, 255, 1)" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // background: "#05053bff",
        // boxShadow: "0 0 30px 5px #3a1c71 inset",
        background: "linear-gradient(180deg, #00002e, #0a0a5a)",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        p: { xs: 2, sm: 3, md: 2 },
        gap: 3,
        position: "relative",
      }}
    >
      {/* BACK BUTTON */}
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

      <Card
        sx={{
          width: { xs: "100%", sm: "90%", md: "560px" },
          borderRadius: 3,
          border: "1px solid #0bdcf8ff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          background: "transparent",
          backdropFilter: "blur(12px)",
          color: "white",
          position: "relative",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Body Metrics
          </Typography>

          {/* HEIGHT */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Ruler size={22} /> Height
            </Typography>

            {heightUnit === "cm" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  style={{
                    width: "60px",
                    padding: "0.2rem",
                    borderRadius: "0.3rem",
                    border: "1px solid #c7d2fe",
                    background: "transparent",
                    color: "#62bcf9ff",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                />
                cm
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="number"
                  value={convertHeight(height, "feet").feet}
                  onChange={(e) => {
                    const inches = convertHeight(height, "feet").inches;
                    setHeight(convertHeight({ feet: Number(e.target.value), inches }, "cm"));
                  }}
                  style={{
                    width: "40px",
                    padding: "0.2rem",
                    borderRadius: "0.3rem",
                    border: "1px solid #c7d2fe",
                    background: "transparent",
                    color: "#62bcf9ff",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                />
                ft
                <input
                  type="number"
                  value={convertHeight(height, "feet").inches}
                  onChange={(e) => {
                    const feet = convertHeight(height, "feet").feet;
                    setHeight(convertHeight({ feet, inches: Number(e.target.value) }, "cm"));
                  }}
                  style={{
                    width: "40px",
                    padding: "0.2rem",
                    borderRadius: "0.3rem",
                    border: "1px solid #c7d2fe",
                    background: "transparent",
                    color: "#62bcf9ff",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                />
                in
              </div>
            )}

            {/* TOGGLE BUTTONS */}
            <ToggleButtonGroup
              value={heightUnit}
              exclusive
              onChange={(_, newUnit) => newUnit && setHeightUnit(newUnit)}
              sx={{ border: "1px solid #c7d2fe", borderRadius: "0.5rem", }}
            >
              <ToggleButton value="cm" sx={{ color: "#f1f2f6ff","&.Mui-selected": { color: "#349bfcff" },  fontWeight: "bold" }}>cm</ToggleButton>
              <ToggleButton value="feet" sx={{ color: "#ffffffff", "&.Mui-selected": { color: "#349bfcff"  }, fontWeight: "bold" }}>ft/in</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Slider
            value={height}
            min={100}
            max={250}
            step={1}
            marks={heightMarks}
            onChange={(_, newValue) => setHeight(newValue)}
            sx={sliderStyles}
          />

          <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.9)" }} />

          {/* WEIGHT */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Weight size={22} /> Weight
            </Typography>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              style={{
                width: "60px",
                padding: "0.2rem",
                borderRadius: "0.3rem",
                border: "1px solid #c7d2fe",
                background: "transparent",
                color: "#62bcf9ff",
                textAlign: "center",
              }}
            />
            Kg
          </Box>
          <Slider
            value={weight}
            min={30}
            max={200}
            step={1}
            marks={weightMarks}
            onChange={(_, newValue) => setWeight(newValue)}
            sx={sliderStyles}
          />

          <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.9)" }} />

          {/* AGE */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={18} /> Age
            </Typography>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{
                width: "60px",
                padding: "0.2rem",
                borderRadius: "0.3rem",
                border: "1px solid #c7d2fe",
                background: "transparent",
                color: "#62bcf9ff",
                textAlign: "center",
              }}
            />
            Years
          </Box>
          <Slider
            value={age}
            min={10}
            max={100}
            step={1}
            marks={ageMarks}
            onChange={(_, newValue) => setAge(newValue)}
            sx={sliderStyles}
          />
        </CardContent>
      </Card>

      {/* NEXT BUTTON */}
      <button
        onClick={handleNext}
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #0bdcf8ff",
          background: "#02013b",
          color: "#fff",
          cursor: "pointer",
        }}
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
    </Box>
  );
};

export default Bodystats;

