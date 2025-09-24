import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Box,
  Divider
} from "@mui/material";
import { Ruler, Weight, Calendar, MoveRight, MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";




const Bodystats = () => {
  const [height, setHeight] = useState(() => Number(sessionStorage.getItem("height")) || 170);
  const [weight, setWeight] = useState(() => Number(sessionStorage.getItem("weight")) || 65);
  const [age, setAge] = useState(() => Number(sessionStorage.getItem("age")) || 25);

  useEffect(() => {
    sessionStorage.setItem("height", height);
    sessionStorage.setItem("weight", weight);
    sessionStorage.setItem("age", age);
  }, [height, weight, age]);

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

  const navigate= useNavigate()

    const handleNext = () => {
        navigate("/focusarea");
    };

  const handleBack = () => navigate(-1);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#05053bff",
          boxShadow: "0 0 30px 5px #3a1c71 inset",
          p: { xs: 2, sm: 3, md: 2 },
          gap: 3,
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

        <Card
          sx={{
            width: { xs: "100%", sm: "90%", md: "560px" },
            height: { xs: "auto", sm: "auto", md: "80vh" },
            borderRadius: 3,
            border: "1px solid #0bdcf8ff",
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            background: "transparent",
            backdropFilter: "blur(12px)",
            color: "white",
            position: "relative",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3, md: 4 },
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: { xs: 2, md: 2 },
                fontSize: { xs: "1.2rem", md: "1.6rem" },
              }}
            >
              Body Metrics
            </Typography>

            {/* HEIGHT */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "0.9rem", md: "1.1rem" },
                }}
              >
                <Ruler size={22} /> Height
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#c7d2fe",
                  fontSize: { xs: "1rem", md: "1.3rem" },
                }}
              >
                {height}{" "}
                <span style={{ fontSize: "0.9rem", color: "#a5b4fc" }}>cm</span>
              </Typography>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: "0.9rem", md: "1.1rem" } }}
              >
                <Weight size={22} /> Weight
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#c7d2fe",
                  fontSize: { xs: "1rem", md: "1.3rem" },
                }}
              >
                {weight}{" "}
                <span style={{ fontSize: "0.9rem", color: "#a5b4fc" }}>kg</span>
              </Typography>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: "0.9rem", md: "1.1rem" } }}
              >
                <Calendar size={18} /> Age
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#c7d2fe",
                  fontSize: { xs: "1rem", md: "1.3rem" },
                }}
              >
                {age}{" "}
                <span style={{ fontSize: "0.9rem", color: "#a5b4fc" }}>yrs</span>
              </Typography>
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
        <div
          className="action-buttons"
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            width: "100%",
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
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={handleNext}
          >
            Next <MoveRight size={24} />
          </button>
        </div>
      </Box>
    </>
  );
};

export default Bodystats;
