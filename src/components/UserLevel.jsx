import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const USER_PROGRESS_KEY = "user_progress_history";

const UserLevel = () => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);

  const getExpForLevel = (lvl) => Math.floor(1000 * Math.pow(1.15, lvl - 1));

  const loadProgress = () => {
    const progressData = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY)) || {};
    const latestProgress = Object.values(progressData).pop();

    if (latestProgress) {
      const currentLevel = latestProgress.level || 1;
      setLevel(currentLevel);
      setExp(latestProgress.exp || 0);
      setExpForNextLevel(getExpForLevel(currentLevel));

      try {
        const storedDifficulty = sessionStorage.getItem("userDifficulty");
        let currentTier = storedDifficulty ? JSON.parse(storedDifficulty) : "beginner";

        let newTier = currentTier;
        if (currentLevel >= 75 && currentTier === "intermediate") {
          newTier = "advanced";
        } else if (currentLevel >= 41 && currentTier === "beginner") {
          newTier = "intermediate";
        }

        if (newTier !== currentTier) {
          sessionStorage.setItem("userDifficulty", JSON.stringify(newTier));
        }
      } catch (e) {
        console.error("Failed to process tier promotion:", e);
      }
    }
  };

  useEffect(() => {
    loadProgress();
    window.addEventListener("userProgressUpdated", loadProgress);
    return () =>
      window.removeEventListener("userProgressUpdated", loadProgress);
  }, []);

  const percent = Math.min((exp / expForNextLevel) * 100, 100);

  return (
    <motion.div 
      className="user-level"
      style={{
        // background:
        //   "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        borderRadius: 20,
        padding: "1rem 1.5rem",
        color: "#fff",
        marginTop: "1.5rem",
        boxShadow: "rgb(172 23 255 / 75%) 0px 2px 30px inset",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.4rem" }}
        >
          Level {level}
        </h3>
        <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
          {exp} / {expForNextLevel} XP
        </span>
      </div>
      <div
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.1)",
          height: "10px",
          borderRadius: "10px",
          marginBottom: "6px",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "linear-gradient(90deg, #a78bfa, #f472b6)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default UserLevel;


// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useUser } from "@clerk/clerk-react";
// import { getUserData } from "../api/userApi";

// const getExpForLevel = (lvl) => Math.floor(1000 * Math.pow(1.15, lvl - 1));

// const UserLevel = () => {
//   const { user, isSignedIn } = useUser();
//   const [level, setLevel] = useState(1);
//   const [exp, setExp] = useState(0);
//   const [expForNextLevel, setExpForNextLevel] = useState(getExpForLevel(1));

//   const loadProgress = async () => {
//     if (!isSignedIn || !user) return;
//     try {
//       const data = await getUserData(user.id);
//       const lvl = data?.level ?? 1;
//       const xpVal = data?.xp ?? 0;
//       setLevel(lvl);
//       setExp(xpVal);
//       setExpForNextLevel(getExpForLevel(lvl));
//     } catch (err) {
//       console.error("Failed to load user progress:", err);
//     }
//   };

//   useEffect(() => {
//     loadProgress();
//     window.addEventListener("userProgressUpdated", loadProgress);
//     return () =>
//       window.removeEventListener("userProgressUpdated", loadProgress);
//   }, [user?.id, isSignedIn]);

//   const percent = Math.min((exp / expForNextLevel) * 100, 100);

//   return (
//     <motion.div
//       className="user-level"
//       style={{
//         borderRadius: 20,
//         padding: "1rem 1.5rem",
//         color: "#fff",
//         marginTop: "1.5rem",
//         boxShadow: "rgb(172 23 255 / 75%) 0px 2px 30px inset",
//         border: "1px solid rgba(255,255,255,0.05)",
//         backdropFilter: "blur(12px)",
//         display: "flex",
//         flexDirection: "column",
//         gap: "0.8rem",
//       }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h3 style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.4rem" }}>
//           Level {level}
//         </h3>
//         <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
//           {exp} / {expForNextLevel} XP
//         </span>
//       </div>
//       <div
//         style={{
//           width: "100%",
//           background: "rgba(255,255,255,0.1)",
//           height: "10px",
//           borderRadius: "10px",
//           marginBottom: "6px",
//           overflow: "hidden",
//         }}
//       >
//         <motion.div
//           style={{
//             width: `${percent}%`,
//             height: "100%",
//             background: "linear-gradient(90deg, #a78bfa, #f472b6)",
//           }}
//           initial={{ width: 0 }}
//           animate={{ width: `${percent}%` }}
//           transition={{ duration: 0.6 }}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default UserLevel;
