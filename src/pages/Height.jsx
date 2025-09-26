import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRight, MoveLeft } from "lucide-react";

const Height = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState("cm");
  const [heightCm, setHeightCm] = useState(170.2);
  const [displayHeightCm, setDisplayHeightCm] = useState(170.2);
  const rulerRef = useRef(null);
  const animationRef = useRef(null);

  const MIN_CM = 100;
  const MAX_CM = 250;
  const PIXELS_PER_UNIT = 20;
  const SUBDIVISIONS = 10;

  useEffect(() => {
    if (rulerRef.current) {
      const initialScrollTop = (heightCm - MIN_CM) * PIXELS_PER_UNIT;
      rulerRef.current.scrollTop = initialScrollTop;
    }
  }, []);

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
      const newHeight = MIN_CM + scrollTop / PIXELS_PER_UNIT;

      setHeightCm(parseFloat(newHeight.toFixed(1)));
    }
  };

  const convertCmToFtIn = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches: parseFloat(inches.toFixed(1)) };
  };

  const Ruler = useMemo(() => {
    const ticks = [];
    for (let i = MIN_CM; i <= MAX_CM; i++) {
      for (let j = 0; j < SUBDIVISIONS; j++) {
        const isMajorTick = j === 0;
        ticks.push(
          <div key={`${i}-${j}`} className="ruler-tick-container">
            {isMajorTick && <span className="ruler-label" style={{ color: "#fff", fontSize: "0.8rem" }}>{i}</span>}
            <div
              style={{
                height: isMajorTick ? "2px" : "1px",
                width: isMajorTick ? "25px" : "15px",
              }}
              className="ruler-tick"
            ></div>
          </div>,
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

    const displayedHeight =
    unit === "cm"
        ? displayHeightCm.toFixed(1)
        : `${convertCmToFtIn(displayHeightCm).feet}' ${
            convertCmToFtIn(displayHeightCm).inches
        }"`;
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
        background: "#00002e",
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

        <div  style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
          marginBottom: "1rem",
        }}>
        <h1 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>
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
        <div className="main-content" 
            style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center",justifyItems: "center", gap: "4rem", width: "100%", maxWidth: "400px",position: "relative",}}>
        <div className="height-display-container"
         style={{ gap: "0.5rem", display: "flex", alignItems: "baseline", position:"absolute", top: "2rem", }}>
          <span style={{color: "#fff", fontSize: "2.2rem", fontWeight: "500"}}
          >{displayedHeight}</span>
          <span style={{color: "#fff", fontSize: "1.5rem",}}>{unit === "cm" ? "cm" : ""}</span>
        </div>

        <div className="content-wrapper" 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "0rem",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          transform: "translatex(2rem)",
          
        }}>
          <img
            src="/public/toji.png"
            alt="Fitness model"
            className="character-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/280x400/EFEFEF/png?text=Image+Not+Found";
            }}
          />
          <div style={{ position: "relative" }}>
            <div className="selector-line"
            style={{
                position: "absolute",
                top: "20%",
                left: "0",
                right: "0",
                height: "2px",
                backgroundColor: "#0bdcf8ff",
                zIndex: 2,
                width: "13rem",
                transform: "translateX(-130px)",
              }}></div>
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
                  >
                    Next <MoveRight />
                  </button>
                </div>
        </div>
    </div>
  );
};

export default Height;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { MoveLeft, MoveRight } from "lucide-react";

// const Height = () => {
//   const navigate = useNavigate();

//   const savedHeight = sessionStorage.getItem("userHeight");
//   const savedUnit = sessionStorage.getItem("heightUnit");

//   const [unit, setUnit] = useState(savedUnit || "cm");
//   const [height, setHeight] = useState(() => {
//     return savedHeight ? parseFloat(savedHeight) : unit === "cm" ? 170 : 5.6;
//   });

//   const handleBack = () => navigate(-1);

//   const handleNext = () => {
//     const heightInMeters = unit === "cm" ? height / 100 : height * 0.3048;
//     sessionStorage.setItem("userHeight", heightInMeters);
//     sessionStorage.setItem("heightUnit", unit);
//     sessionStorage.setItem("originalHeight", height);
//     sessionStorage.setItem("originalHeightUnit", unit);
//     navigate("/weight");
//   };

//   const handleHeightChange = (e) => {
//     setHeight(parseFloat(e.target.value));
//   };

//   useEffect(() => {
//     if (unit === "cm") {
//       setHeight(170);
//     } else {
//       setHeight(5.6);
//     }
//   }, [unit]);

//   const min = unit === "cm" ? 100 : 4;
//   const max = unit === "cm" ? 220 : 7.5;
//   const step = unit === "cm" ? 1 : 0.1;

//   // Generate more tick marks
//   const generateTickMarks = () => {
//     const ticks = [];
//     const numTicks = 8;
//     for (let i = 0; i < numTicks; i++) {
//       const value = min + ((max - min) * i) / (numTicks - 1);
//       ticks.push(unit === "cm" ? Math.round(value) : value.toFixed(1));
//     }
//     return ticks;
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         position: "relative",
//         background: "#00002e",
//         boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
//         padding: "1.5rem",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-around",
//       }}
//     >
//       {/* Back Button */}
//       <button
//         style={{
//           position: "absolute",
//           top: "1rem",
//           left: "1rem",
//           padding: "0.5rem 1rem",
//           borderRadius: "0.5rem",
//           border: "none",
//           color: "#acaab4ff",
//           cursor: "pointer",
//           background: "transparent",
//           transition: "transform 0.15s",
//           zIndex: 30,
//         }}
//         onClick={handleBack}
//         onMouseOver={(e) =>
//           (e.currentTarget.style.transform = "translateX(-3px)")
//         }
//         onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
//       >
//         <MoveLeft size={34} />
//       </button>

//       <div
//         style={{
//           width: "100%",
//           maxWidth: "400px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "4rem",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <h1 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>
//             What's your height?
//           </h1>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             background: "#17188baf",
//             borderRadius: "99px",
//             padding: "0.25rem",
//             width: "50%",
//             height: "3rem",
//           }}
//         >
//           <button
//             onClick={() => setUnit("cm")}
//             style={{
//               flex: 1,
//               padding: "0.75rem 1rem",
//               borderRadius: "99px",
//               background: unit === "cm" ? "#fff" : "transparent",
//               color: unit === "cm" ? "#000" : "#ccc",
//               fontWeight: "600",
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.2s",
//             }}
//           >
//             cm
//           </button>
//           <button
//             onClick={() => setUnit("ft")}
//             style={{
//               flex: 1,
//               padding: "0.75rem 1rem",
//               borderRadius: "99px",
//               background: unit === "ft" ? "#fff" : "transparent",
//               color: unit === "ft" ? "#000" : "#ccc",
//               fontWeight: "600",
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.2s",
//             }}
//           >
//             ft
//           </button>
//         </div>

//         {/* Slider */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff",
//             width: "100%",
//             maxWidth: "400px",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "3rem",
//               fontWeight: "300",
//               marginBottom: "1rem",
//             }}
//           >
//             {unit === "cm" ? height : height.toFixed(1)}{" "}
//             <span style={{ fontSize: "1.5rem", color: "#aaa" }}>{unit}</span>
//           </div>

//           <input
//             type="range"
//             min={min}
//             max={max}
//             step={step}
//             value={height}
//             onChange={handleHeightChange}
//             style={{
//               width: "100%",
//               maxWidth: "400px",
//               height: "8px",
//               borderRadius: "4px",
//               background: "#17188baf",
//               appearance: "none",
//               outline: "none",
//               cursor: "pointer",
//             }}
//           />

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               width: "100%",
//               maxWidth: "400px",
//               marginTop: "0.5rem",
//               fontSize: "0.8rem",
//               color: "#aaa",
//             }}
//           >
//             {generateTickMarks().map((tick, idx) => (
//               <span key={idx}>{tick}</span>
//             ))}
//           </div>
//         </div>
//         </div>

//         {/* Next Button */}
//         <div style={{ marginBottom: "1rem" }}>
//           <button
//             onClick={handleNext}
//             className="btn btn-primary"
//             style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "0.5rem",
//             padding: "0.75rem 1.5rem",
//             borderRadius: "0.5rem",
//             border: "1px solid #0bdcf8ff ",
//             background: "#02013b",
//             color: "#fff",
//             cursor: "pointer",
//             }}
//           >
//             Next <MoveRight />
//           </button>
//         </div>
//       </div>
//   );
// };

// export default Height;
