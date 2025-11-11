import React, { useEffect, useState } from "react";
// import { FiChevronRight } from "react-icons/fi";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const TOTAL_KEY = "totalCalories";
const HISTORY_KEY = "calorieHistory";

const calculateCalories = (exercise, userWeight = 70) => {
  const timeInHours = (exercise.time || 0) / 60;
  const met = exercise.met || 6; 
  return met * userWeight * timeInHours;
};

const ExerciseList = ({ workoutType }) => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState(workoutType || "All");
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          "https://testing-backend-4cpr.onrender.com/api/exercise/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        const exercisesWithData = Array.isArray(data)
          ? data.map((ex) => ({
              ...ex,
              met: Math.floor(Math.random() * 6) + 4,
              time: 15,
            }))
          : [];
        setExercises(exercisesWithData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    getData();
  }, [getToken]);

  useEffect(() => {
    if (workoutType) {
      setSelectedBodyPart(workoutType);
    }
  }, [workoutType]);

  // Persist helper: append to history and update total
  const persistCalories = (exercise, caloriesBurned) => {
    // Read previous total and history
    const prevTotal = parseFloat(localStorage.getItem(TOTAL_KEY)) || 0;
    const newTotal = prevTotal + Number(caloriesBurned || 0);

    // Update total
    localStorage.setItem(TOTAL_KEY, newTotal.toFixed(0));

    // Update history array
    const prevHistoryJSON = localStorage.getItem(HISTORY_KEY);
    let history = [];
    try {
      history = prevHistoryJSON ? JSON.parse(prevHistoryJSON) : [];
    } catch {
      history = [];
    }

    const entry = {
      id: exercise.id ?? Date.now(),
      title: exercise.title ?? "Unknown",
      caloriesBurned: Number(Number(caloriesBurned).toFixed(2)),
      time: exercise.time || 0,
      met: exercise.met || null,
      timestamp: new Date().toISOString(),
    };

    history.push(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    return newTotal;
  };

  const handleExerciseComplete = (exercise) => {
    const userWeight = parseFloat(sessionStorage.getItem("userWeight")) || 70;
    const caloriesBurned = calculateCalories(exercise, userWeight);

    // Dispatch stats update
    const newStats = {
      strength: Math.floor(Math.random() * 2) + 1, // Gain 1 or 2
      stamina: Math.floor(Math.random() * 2) + 1,
      agility: Math.floor(Math.random() * 2), // Gain 0 or 1
    };
    window.dispatchEvent(new CustomEvent("statsUpdated", { detail: newStats }));

    // Dispatch calories update
    const newTotal = persistCalories(exercise, caloriesBurned);
    window.dispatchEvent(
      new CustomEvent("caloriesUpdated", {
        detail: { ...exercise, caloriesBurned, newTotal },
      })
    );

    alert(
      `✅ ${exercise.title} completed!`
      // `✅ ${exercise.title} completed!\n🔥 Calories burned: ${caloriesBurned.toFixed(0)} kcal\n
      //  Total: ${newTotal.toFixed(0)} kcal`
    );
  };

  const handleStart = (exercise) => {
    navigate(`/exercise/${exercise.title}`, { state: { exercise } });
  };

  const bodyParts = ["All", ...new Set(exercises.map((ex) => ex.bodypart))];

  const filteredExercises = exercises
    .filter((exercise) => {
      if (selectedBodyPart === "All") {
        return true;
      }
      return exercise.bodypart === selectedBodyPart;
    })
    .filter((exercise) =>
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="bg-neutral flex flex-col items-center py-10 px-4">

      {/* ✅ Search and Filter */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <BiSearch
            style={{
              position: "absolute",
              left: "0.75rem",
              color: "#9ca3af",
            }}
            size={20}
          />
          <input
            type="text"
            placeholder="Search exercises"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem 1rem 0.5rem 2.5rem",
              borderRadius: "10px",
              border: "1px solid #0bdcf8ff",
              background: "transparent",
              color: "#fff",
              width: "300px",
              fontSize: "1rem",
              height: "2.5rem",
            }}
          />
        </div>

        <select
          value={selectedBodyPart}
          onChange={(e) => setSelectedBodyPart(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            border: "1px solid #0bdcf8ff",
            background: "#02013b",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
            height: "2.5rem",
          }}
        >
          {bodyParts.map((part) => (
            <option key={part} value={part}>{part}</option>
          ))}
        </select>
      </div>

      <div
        className="exercise-list"
        tabIndex={0}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "1.5rem",
          maxHeight: "70vh",
          marginBottom: "8rem",
          overflowY: "auto",
          top: "11rem",
        }}
      >
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            style={{
              maxWidth: 500,
              margin: "0",
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
              borderRadius: 20,
              padding: "0.8rem",
              color: "#fff",
              boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              lineHeight: "1.6",
            }}
          >
            <div
              className="exercise-card"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", textAlign: "start"}}>
                <h2 className="text-lg font-semibold" style={{ textAlign: "start" }}>
                  {exercise.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  Reps: {exercise.reps_sets}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleStart(exercise)}
                  className="text-white text-xl focus:outline-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
                    color: "#fff",
                    border: "none",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "0.3rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  Start
                </button>

                <button
                  onClick={() => handleExerciseComplete(exercise)}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(34,197,94,1), rgba(16,185,129,1))",
                    color: "#fff",
                    border: "none",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-neutral-600 col-span-full text-center py-10">
            Loading exercises...
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;






// import React, { useEffect, useState } from "react";
// import { BiSearch } from 'react-icons/bi';
// import { FiChevronUp, FiChevronDown } from "react-icons/fi";
// import { useAuth } from '@clerk/clerk-react';

// const ExerciseList = () => {
//   const [exercises, setExercises] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);
//   const { getToken } = useAuth();

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const token = await getToken();
//         const response = await fetch(
//           "https://wmddgktx-8000.inc1.devtunnels.ms/api/exercise/",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const data = await response.json();
//         setExercises(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching exercises:", error);
//       }
//     };
//     getData();
//   }, []);

//   const toggleExpand = (exerciseId) => {
//     setExpandedId(expandedId === exerciseId ? null : exerciseId);
//   };


//   const handleExerciseComplete = (exercise) => {
//     const newStats = {
//       strength: Math.floor(Math.random() * 5) + 1,
//       stamina: Math.floor(Math.random() * 5) + 1,
//       agility: Math.floor(Math.random() * 3) + 1,
//     };


//     window.dispatchEvent(
//       new CustomEvent("statsUpdated", { detail: newStats })
//     );

//     alert(`✅ ${exercise.title} completed! Stats updated live.`);
//   };

//   return (
//     <div className="bg-neutral flex flex-col items-center py-10 px-4">
//       <h1
//         className="ex-head"
//         style={{
//           fontSize: "1.6rem",
//           fontWeight: "500",
//           marginTop: "0.8rem",
//           marginBottom: "1rem",
//           color: "#fff",
//         }}
//       >
//         Exercise List
//       </h1>

//       <div
//         className="exercise-list"
//         tabIndex={0}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "flex-start",
//           gap: "1.5rem",
//           maxHeight: "75vh",
//           marginBottom: "4rem",
//           overflowY: "auto",
//           top: "11rem",
//         }}
//       >
//         {exercises.map((exercise) => (
//           <div
//             key={exercise.id}
//             style={{
//               maxWidth: 500,
//               margin: "0",
//               background:
//                 "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
//               borderRadius: 20,
//               padding: "1rem",
//               color: "#fff",
//               boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
//               border: "1px solid rgba(255,255,255,0.05)",
//               backdropFilter: "blur(12px)",
//               lineHeight: "2",
//             }}
//           >
//             <div
//               className="exercise-card"
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 cursor: "pointer",
//               }}
//             >
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 <h2 className="text-lg font-semibold" style={{ textAlign: "start" }}>
//                   {exercise.title}
//                 </h2>
//                 <p className="text-sm text-neutral-400 mt-1">
//                   Reps: {exercise.reps_sets}
//                 </p>
//               </div>
//               <div style={{ display: "flex", gap: "0.5rem" }}>
//                 <button
//                   onClick={() => toggleExpand(exercise.id)}
//                   className="text-white text-xl focus:outline-none"
//                   style={{
//                     background:
//                       "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
//                     color: "#fff",
//                     border: "none",
//                     padding: "0.2rem 0.6rem",
//                     borderRadius: "10px",
//                     fontSize: "1rem",
//                     fontWeight: "600",
//                     display: "flex",
//                     alignItems: "center",
//                     cursor: "pointer",
//                     gap: "0.3rem",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   Start
//                   {expandedId === exercise.id ? (
//                     <FiChevronUp />
//                   ) : (
//                     <FiChevronDown />
//                   )}
//                 </button>

//                 {/* ✅ Complete Button */}
//                 <button
//                   onClick={() => handleExerciseComplete(exercise)}
//                   style={{
//                     background:
//                       "linear-gradient(90deg, rgba(34,197,94,1), rgba(16,185,129,1))",
//                     color: "#fff",
//                     border: "none",
//                     padding: "0.3rem 0.7rem",
//                     borderRadius: "10px",
//                     fontSize: "0.9rem",
//                     fontWeight: "600",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Complete
//                 </button>
//               </div>
//             </div>

//             {expandedId === exercise.id && (
//               <div className="mt-4 flex justify-center">
//                 {/* <iframe
//                   width="100%"
//                   height="250px"
//                   src={
//                     exercise.url?.includes("youtu.be")
//                       ? exercise.url.replace("youtu.be/", "www.youtube.com/embed/")
//                       : exercise.url
//                   }
//                   title={exercise.title}
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                   allowFullScreen
//                 ></iframe> */}
//                 <iframe width="560" height="315" src="https://www.youtube.com/embed/ZyjQar-XgBc?si=A4o7iY8tTr-F7VjE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
//               </div>
//             )}
//           </div>
//         ))}

//         {exercises.length === 0 && (
//           <div className="text-neutral-600 col-span-full text-center py-10">
//             Loading exercises...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExerciseList;
