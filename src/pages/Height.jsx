import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRight, MoveLeft } from "lucide-react";

const Height = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState(() => sessionStorage.getItem("heightUnit") || "cm");
  const [heightCm, setHeightCm] = useState(
    () => Number(sessionStorage.getItem("originalHeight")) || 150
  );
  const [displayHeightCm, setDisplayHeightCm] = useState(
    () => Number(sessionStorage.getItem("originalHeight")) || 150
  );
  const rulerRef = useRef(null);
  const animationRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);

  const MIN_CM = 127;
  const MAX_CM = 220;
  const PIXELS_PER_UNIT = 36;
  const SUBDIVISIONS = 10;

  useEffect(() => {
    if (rulerRef.current) {
      const initialScrollTop =
        (MAX_CM - heightCm) * PIXELS_PER_UNIT; 
      rulerRef.current.scrollTop = initialScrollTop;
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("heightUnit", unit);
    sessionStorage.setItem("originalHeight", heightCm);
  }, [unit, heightCm]);


  useEffect(() => {
    clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      setDisplayHeightCm((prev) => {
        const diff = heightCm - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(animationRef.current);
          return heightCm;
        }
        return prev + diff * 0.1;
      });
    }, 16);
    return () => clearInterval(animationRef.current);
  }, [heightCm]);


  const handleScroll = () => {
    if (rulerRef.current) {
      const scrollTop = rulerRef.current.scrollTop;
      const newHeight = MAX_CM - scrollTop / PIXELS_PER_UNIT; 
      setHeightCm(Math.min(MAX_CM, Math.max(MIN_CM, newHeight)));
    }
  };


  const handleMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = rulerRef.current.scrollTop;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaY = e.clientY - startY.current;
    rulerRef.current.scrollTop = startScroll.current - deltaY; 
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const ruler = rulerRef.current;
    if (!ruler) return;

    ruler.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      ruler.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);


  const convertCmToFtIn = (cm) => {
    const totalInches = cm / 2.54;
    let feet = Math.floor(totalInches / 12);
    let inches = Math.round(totalInches % 12);
    if (inches === 12) {
      feet += 1;
      inches = 0;
    }
    return { feet, inches };
  };

  const Ruler = useMemo(() => {
    const ticks = [];
    for (let i = MAX_CM; i >= MIN_CM; i--) {
      for (let j = 0; j < SUBDIVISIONS; j++) {
        const isMajorTick = j === 0;
        ticks.push(
          <div key={`${i}-${j}`} className="ruler-tick-container">
            {isMajorTick && (
              <span
                className="ruler-label"
                style={{ color: "#fff", fontSize: "0.8rem" }}
              >
                {i}
              </span>
            )}
            <div
              style={{
                height: isMajorTick ? "2px" : "1px",
                width: isMajorTick ? "25px" : "15px",
              }}
              className="ruler-tick"
            ></div>
          </div>
        );
      }
    }
    return (
      <div className="ruler-wrapper">
        <div style={{ height: "50%" }}></div>
        {ticks}
        <div style={{ height: "50%" }}></div>
      </div>
    );
  }, [SUBDIVISIONS]);

  const userGender = sessionStorage.getItem("userGender");
  const characterImage = userGender === "female" ? "/public/luna.png" : "/public/toji.png";

  const displayedHeight =
    unit === "cm"
      ? `${Math.round(displayHeightCm)}`
      : `${convertCmToFtIn(displayHeightCm).feet}' ${convertCmToFtIn(displayHeightCm).inches}"`;

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    const heightInMeters = heightCm / 100;
    sessionStorage.setItem("userHeight", heightInMeters);
    sessionStorage.setItem("heightUnit", unit);
    sessionStorage.setItem("originalHeight", heightCm);
    sessionStorage.setItem("originalHeightUnit", "cm");
    navigate("/weight");
  };

  return (
    <div
      className="bodystats-container"
      style={{
        height: "100vh",
        position: "relative",
        background: "linear-gradient(180deg, #00002e, #0a0a5a)",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        minHeight: "fit-content",
      }}
    >
      {/* Back Button */}
      <button
        style={{
          position: "absolute",
          left: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          color: "#acaab4ff",
          cursor: "pointer",
          top: "1rem",
          background: "transparent",
          transition: "transform 0.15s",
          zIndex: 30,
        }}
        onClick={handleBack}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "translateX(-3px)")
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
      >
        <MoveLeft size={34} />
      </button>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
      >
        <h1 className="heading"  style={{ color: "#fff", margin: 0 }}>
          What's your height?
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="unit-toggle-container">
          <button
            className={`unit-button ${
              unit === "cm" ? "active-unit" : "inactive-unit"
            }`}
            onClick={() => setUnit("cm")}
          >
            cm
          </button>
          <button
            className={`unit-button ${
              unit === "ft" ? "active-unit" : "inactive-unit"
            }`}
            onClick={() => setUnit("ft")}
          >
            ft
          </button>
        </div>
      </div>

      <div
        className="main-content"
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          gap: "3rem",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
        }}
      >
        <div
          className="height-display-container"
          style={{
            gap: "0.5rem",
            display: "flex",
            alignItems: "baseline",
            position: "absolute",
            // top: "2rem",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "2.2rem",
              fontWeight: "500",
            }}
          >
            {displayedHeight}
          </span>
          <span style={{ color: "#fff", fontSize: "1.5rem" }}>
            {unit === "cm" ? "cm" : ""}
          </span>
        </div>

        <div
          className="content-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "0rem",
            width: "100%",
            maxWidth: "400px",
            position: "relative",
            transform: "translatex(2rem)",
          }}
        >
          <img
            src={characterImage}
            alt="Fitness model"
            className="character-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/280x400/EFEFEF/png?text=Image+Not+Found";
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              className="selector-line"
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                height: "2px",
                backgroundColor: "#0bdcf8ff",
                zIndex: 2,
                // width: "13rem",
                // transform: "translateX(-130px)",
              }}
            ></div>
            <div
              onScroll={handleScroll}
              ref={rulerRef}
              className="ruler-container no-scrollbar"
            >
              {Ruler}
            </div>
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
            Next <MoveRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Height;


