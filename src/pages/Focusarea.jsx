// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MoveLeft, MoveRight } from "lucide-react";

// const bodyParts = [
//   { id: "full", name: "Full Body", img: "/images/fullbody.png" },
//   { id: "chest", name: "Chest", img: "/images/chest.png" },
//   { id: "back", name: "Back", img: "/images/back.png" },
//   { id: "arms", name: "Arms", img: "/images/arms.png" },
//   { id: "legs", name: "Legs", img: "/images/legs.png" },
//   { id: "shoulders", name: "Shoulders", img: "/images/shoulders.png" },
//   { id: "abs", name: "Abs", img: "/images/abs.png" },
// ];

// const Focusarea = () => {
//   const navigate = useNavigate();
//   const [selected, setSelected] = useState([]);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleNext = () => {
//     console.log("Selected parts:", selected);
//     navigate("/equipment");
//   };

//   const toggleSelection = (id) => {
//     if (id === "full") {
//       if (selected.includes("full")) {
//         setSelected([]);
//       } else {
//         setSelected(bodyParts.map((part) => part.id));
//       }
//     } else {
//       let newSelection;
//       if (selected.includes(id)) {
//         newSelection = selected.filter((item) => item !== id);
//       } else {
//         newSelection = [...selected, id];
//       }

//       if (
//         newSelection.length === bodyParts.length - 1 &&
//         !newSelection.includes("full")
//       ) {
//         newSelection.push("full");
//       } else if (
//         newSelection.length < bodyParts.length &&
//         newSelection.includes("full")
//       ) {
//         newSelection = newSelection.filter((item) => item !== "full");
//       }

//       setSelected(newSelection);
//     }
//   };

//   return (
//     <div
//       className="focus-page"
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//         gap: "4rem",
//         paddingTop: "1rem",
//         background: "#00002e",
//         boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       <button
//         style={{
//           position: "absolute",
//           top: "0.8rem",
//           left: "1rem",
//           padding: "0.5rem 1rem",
//           borderRadius: "0.5rem",
//           border: "none",
//           color: "#acaab4ff",
//           cursor: "pointer",
//           zIndex: 2,
//           background: "transparent",
//           transition: "transform 0.15s",
//         }}
//         onClick={handleBack}
//         onMouseOver={(e) =>
//           (e.currentTarget.style.transform = "translateX(-3px)")
//         }
//         onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
//       >
//         <MoveLeft size={34} />
//       </button>
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3rem", justifyContent: "center", minHeight: "150vh", marginTop: "6rem" }}>
//         <div className='focus-text' style={{ marginTop: "-8rem", textAlign: "center", fontSize: "2.2rem", color: "white", }}>
//           <h2 style={{ color: "#fff" }}>Select your focus Area</h2>
//         </div>
//         <div className="focus-card">
//           <div className="focus-list" style={{ display: "flex", flexDirection: "column", gap: "1.7rem", padding: "2rem", }}>
//             {bodyParts.map((part) => (
//               <div
//                 key={part.id}
//                 onClick={() => toggleSelection(part.id)}
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: "1rem",
//                   fontSize: "1.2rem",
//                   width: "15rem",
//                   height: "5.5rem",
//                   cursor: "pointer",
//                   textAlign: "center",
//                   border: selected.includes(part.id)
//                     ? "1px solid #4caf50"
//                     : "1px solid #0505de",
//                   borderRadius: "0.75rem",
//                   padding: "1.4rem",
//                   background: selected.includes(part.id) ? "#16997681" : "#17188baf",
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 <p style={{ color: "#fff" }}>{part.name}</p>
//                 <img
//                   src={part.img}
//                   style={{
//                     width: "60px",
//                     height: "60px",
//                     objectFit: "contain",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//           </div>
//           <div
//             className="action-buttons"
//             style={{ display: "flex", gap: "1rem" }}
//           >
//             <button
//               className="btn btn-primary"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 padding: "0.75rem 1.5rem",
//                 borderRadius: "0.5rem",
//                 border: "1px solid #0bdcf8ff ",
//                 background: "#02013b",
//                 color: "#fff",
//                 opacity: selected.length === 0 ? 0.5 : 1,
//                 cursor: selected.length === 0 ? "not-allowed" : "pointer",
//               }}
//               onClick={handleNext}
//               disabled={selected.length === 0}
//             >
//               Next <MoveRight />
//             </button>
//           </div>
//         </div>
//     </div>
//   );
// };

// export default Focusarea;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const bodyParts = [
  { id: "full", name: "Full Body", img: "/images/fullbody.png" },
  { id: "chest", name: "Chest", img: "/images/chest.png" },
  { id: "back", name: "Back", img: "/images/back.png" },
  { id: "arms", name: "Arms", img: "/images/arms.png" },
  { id: "legs", name: "Legs", img: "/images/legs.png" },
  { id: "shoulders", name: "Shoulders", img: "/images/shoulders.png" },
  { id: "abs", name: "Abs", img: "/images/abs.png" },
];

const Focusarea = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    console.log("Selected parts:", selected);
    navigate("/equipment");
  };

  const toggleSelection = (id) => {
    if (id === "full") {
      setSelected((prev) => (prev.includes("full") ? [] : bodyParts.map((p) => p.id)));
      return;
    }

    setSelected((prev) => {
      let next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];

      // Sync "Full Body" state
      if (next.length === bodyParts.length - 1 && !next.includes("full")) {
        next.push("full");
      } else if (next.length < bodyParts.length && next.includes("full")) {
        next = next.filter((x) => x !== "full");
      }

      return next;
    });
  };

  return (
    <div
      className="focus-page"
      style={{
        height: "100vh",                 // lock viewport height so body doesn't scroll
        position: "relative",
        overflow: "hidden",              // prevent page/body scroll
        background: "#00002e",
        boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
        padding: 0,
      }}
    >
      {/* Fixed Back Button */}
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

      {/* Fixed Title */}
      <div
        className="focus-text"
        style={{
          position: "absolute",
          top: "3rem",
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

      {/* Scrollable Card (only this scrolls) */}
      <div
        className="focus-card"
        tabIndex={0}
        style={{
          position: "absolute",
          top: "8rem",
          bottom: "8rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "300px",
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
            gap: "1.4rem",
            padding: "1rem 0",
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
                justifyContent: "space-between",
                gap: "1rem",
                fontSize: "1.2rem",
                width: "100%",
                height: "4.5rem",
                cursor: "pointer",
                textAlign: "center",
                border: selected.includes(part.id) ? "1px solid #4caf50" : "1px solid #0505de",
                borderRadius: "0.75rem",
                padding: "1.4rem",
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
                  e.currentTarget.style.filter = "grayscale(1)";
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
          bottom: "3rem",
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
    </div>
  );
};

export default Focusarea;
