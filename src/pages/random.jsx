// Quest.jsx (Version 1 - One Quest Per Day)
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GiTreasureMap, GiChest } from "react-icons/gi";
import { FaClock, FaExclamationTriangle, FaTimes, FaCheck } from "react-icons/fa";

const QUEST_HISTORY_KEY = "quest_history";
const USER_PROGRESS_KEY = "user_progress_history";
const QUEST_DATE_KEY = "quest_date_key"; // ✅ added to store quest day

const DailyQuestSession = () => {
  const exercises = ["Push-ups", "Pull-ups", "Crunches", "Burpees", "Plank", "Sit-ups", "Jumping Jacks", "Lunges"];

  const getRandomQuests = () => {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((ex) => ({
      name: ex,
      exp: Math.floor(Math.random() * 21) + 10,
      duration: ex === "Plank" ? Math.floor(Math.random() * 76) + 45 : `${Math.floor(Math.random() * 20) + 10}`,
      completed: false,
      started: false,
      failed: false,
    }));
  };

  const [quests, setQuests] = useState([]);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState({ strength: 0, stamina: 0, agility: 0, endurance: 0, mobility: 0 });
  const [chestOpened, setChestOpened] = useState(false);
  const [timer, setTimer] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [activeStartDuration, setActiveStartDuration] = useState(null);
  const [isPlankReady, setIsPlankReady] = useState(false);
  const [popup, setPopup] = useState(null);
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  const pushToast = (txt) => {
    setToast(txt);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3500);
  };

  const today = new Date().toISOString().slice(0, 10);

  // 🧠 Load quests only once per day
  useEffect(() => {
    const savedQuestDate = localStorage.getItem(QUEST_DATE_KEY);
    const savedQuests = localStorage.getItem(QUEST_HISTORY_KEY);
    const progressHistoryRaw = localStorage.getItem(USER_PROGRESS_KEY);

    if (progressHistoryRaw) {
      const progressHistory = JSON.parse(progressHistoryRaw);
      const allDates = Object.keys(progressHistory).sort();
      if (allDates.length > 0) {
        const latestDate = allDates[allDates.length - 1];
        const latestProgress = progressHistory[latestDate];
        if (latestProgress) {
          setLevel(latestProgress.level || 1);
          setExp(latestProgress.exp || 0);
          setStats(latestProgress.stats || stats);
        }
      }
    }

    if (savedQuestDate === today && savedQuests) {
      // same day, load existing
      const history = JSON.parse(savedQuests);
      if (history[today]) {
        setQuests(history[today]);
        const opened = localStorage.getItem("chest_opened_today");
        setChestOpened(opened === "true");
        return;
      }
    }

    // new day → reset
    const newQuests = getRandomQuests();
    setQuests(newQuests);
    localStorage.setItem(QUEST_DATE_KEY, today);
    localStorage.setItem(QUEST_HISTORY_KEY, JSON.stringify({ [today]: newQuests }));
    localStorage.removeItem("chest_opened_today");
    setChestOpened(false);
  }, []);

  // 🧠 Timer effect for Plank
  useEffect(() => {
    if (timer === 0 && activeQuest !== null) {
      setIsPlankReady(true);
      pushToast("Plank time reached — tap Finish to claim rewards.");
      return;
    }
    if (timer > 0) {
      const id = setInterval(() => setTimer((t) => (t == null ? null : t - 1)), 1000);
      return () => clearInterval(id);
    }
  }, [timer, activeQuest]);

  const saveProgress = (gainedExp, newStats) => {
    const progressHistory = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY)) || {};
    const todayProgress = progressHistory[today] || { level, exp, stats };

    const updatedExp = todayProgress.exp + gainedExp;
    const updatedStats = { ...todayProgress.stats };

    for (const key of Object.keys(newStats)) {
      updatedStats[key] = (updatedStats[key] || 0) + (newStats[key] || 0);
    }

    let newLevel = todayProgress.level;
    let remainingExp = updatedExp;
    let expForNextLevel = Math.floor(1000 * Math.pow(1.1, newLevel - 1));

    while (remainingExp >= expForNextLevel) {
      remainingExp -= expForNextLevel;
      newLevel++;
      expForNextLevel = Math.floor(1000 * Math.pow(1.1, newLevel - 1));
    }

    progressHistory[today] = { level: newLevel, exp: remainingExp, stats: updatedStats };

    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressHistory));
    window.dispatchEvent(new CustomEvent("userExpUpdated"));
  };

  const startQuest = (index) => {
    if (activeQuest !== null) {
      pushToast("Finish current quest first.");
      return;
    }
    const q = quests[index];
    if (!q) return;

    if (q.name === "Plank") {
      setQuests((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], started: true };
        return copy;
      });
      setActiveQuest(index);
      setActiveStartDuration(Number(q.duration));
      setTimer(Number(q.duration));
      pushToast("Plank started — hold steady!");
    } else {
      setQuests((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], completed: true };
        return copy;
      });
      pushToast(`${q.name} completed!`);
    }
  };

  const finishPlank = () => {
    if (activeQuest === null) return;
    const q = quests[activeQuest];
    const gainedExp = q.exp;
    setQuests((prev) => {
      const copy = [...prev];
      copy[activeQuest] = { ...q, completed: true, started: false };
      return copy;
    });
    setExp((prev) => prev + gainedExp);
    setActiveQuest(null);
    setTimer(null);
    setIsPlankReady(false);
    pushToast("Plank finished! Rewards applied.");
  };

  const openChest = () => {
    if (chestOpened) {
      pushToast("Chest already opened today!");
      return;
    }

    const allCompleted = quests.every((q) => q.completed);
    if (!allCompleted) {
      setPopup("warning");
      return;
    }

    const totalExp = quests.reduce((s, q) => s + q.exp, 0);
    const statKeys = Object.keys(stats);
    const randomStatKey = statKeys[Math.floor(Math.random() * statKeys.length)];
    const newStats = { [randomStatKey]: 1 };

    saveProgress(totalExp, newStats);
    setChestOpened(true);
    localStorage.setItem("chest_opened_today", "true");
    setPopup("reward");
    pushToast("Chest opened — rewards claimed!");
  };

  // UI rendering remains unchanged from your version
  return (
    <div style={{ /* keep same CSS */ }}>
      {/* Entire same UI from your original component */}
    </div>
  );
};

export default DailyQuestSession;












// import React, { useEffect, useState } from "react";
// import { BiSearch } from 'react-icons/bi';
// import { FiChevronUp, FiChevronDown } from "react-icons/fi";
// import ReactPlayer from "react-player";
// import {useAuth} from '@clerk/clerk-react';

// const ExerciseList = () => {
//   const [exercises, setExercises] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);


//   const {getToken} = useAuth();

  

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const token = await getToken();
//         const response = await fetch(
//           "https://wmddgktx-8000.inc1.devtunnels.ms/api/exercise/",
//           {
//             headers: {
//               "Authorization": `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await response.json();
//         console.log(data)
//         setExercises(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching exercises:", error);
//       }
//     };

//     getData();
//   }, []);

//   const toggleExpand = (exerciseId) => {
//     if (expandedId === exerciseId) {
//       setExpandedId(null);
//     } else {
//       setExpandedId(exerciseId);
//     }
//   };

//   return (
//     <div className=" bg-neutral flex flex-col items-center py-10 px-4">
//       <h1
//         className="ex-head"
//         style={{
//           fontSize: "1.6rem",
//           fontWeight: "500",
//           marginTop: "0.8rem",
//           marginBottom: "1rem",
//           color: "#fff",
//           overflow: "hidden",
//         }}
//       >
//         Exercise List
//       </h1>

//       <div
//         className="exercise-list "
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
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-start",
//                   justifyContent: "center",
//                 }}
//               >
//                 <h2 className="text-lg font-semibold" style={{
//                   textAlign:"start"
//                 }}>{exercise.title}</h2>
//                 <p className="text-sm text-neutral-400 mt-1">
//                   Reps: {exercise.reps_sets}
//                 </p>
//               </div>
//               <button
//                 onClick={() => toggleExpand(exercise.id)}
//                 className="text-white text-xl focus:outline-none"
//                 style={{
//                   background:
//                     "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
//                   color: "#fff",
//                   border: "none",
//                   padding: "0.2rem 0.6rem",
//                   borderRadius: "10px",
//                   fontSize: "1rem",
//                   fontWeight: "600",
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                   gap: "0.3rem",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 Start
//                 {expandedId === exercise.id ? (
//                   <FiChevronUp />
//                 ) : (
//                   <FiChevronDown />
//                 )}
//               </button>
//             </div>

//             {expandedId === exercise.id && (
//               <div className="mt-4 flex justify-center">
//                 {/* <ReactPlayer
//                   controls
//                   playing={expandedId === exercise.id}
//                   url={
//                     exercise.url?.includes("youtu.be")
//                       ? exercise.url.replace(
//                           "youtu.be/",
//                           "www.youtube.com/watch?v=",
//                         )
//                       : exercise.url
//                   }
//                   title={exercise.title}
//                   width="100%"
//                   height="250px"
//                   onError={() =>
//                     alert(
//                       "This video cannot be embedded. Click 'Watch on YouTube'.",
//                     )
//                   }
//                 /> */}

//                 <iframe
//                   width="100%"
//                   height="250px"
//                   src={
//                     exercise.url?.includes("youtu.be")
//                       ? exercise.url.replace(
//                           "youtu.be/",
//                           "www.youtube.com/embed/",
//                         )
//                       : exercise.url
//                   }
//                  // src={exercise.url}
//                   // src="https://www.youtube.com/embed/ZyjQar-XgBc?si=m9aBCxWNveUyrBH9" 
//                   title={exercise.title}
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                   allowFullScreen>

//                 </iframe>
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

// export default ExerciseList;






// import React, { useState } from "react";
// import { useUser } from "@clerk/clerk-react";

// const random = () => {
//   const { user } = useUser();
//   const [username, setUsername] = useState(user?.username || "");
//   const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");

//   const handleUpdateProfile = async () => {
//     try {
//       await user.update({
//         username,
//         imageUrl,
//       });
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold">Edit Profile</h2>
//       <label>Username</label>
//       <input
//         className="border p-2 rounded"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <label>Profile Image URL</label>
//       <input
//         className="border p-2 rounded"
//         value={imageUrl}
//         onChange={(e) => setImageUrl(e.target.value)}
//       />
//       <button
//         onClick={handleUpdateProfile}
//         className="bg-blue-500 text-white p-2 rounded"
//       >
//         Save Changes
//       </button>
//     </div>
//   );
// };

// export default random;






// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { motion } from "framer-motion";
// import { GiTreasureMap, GiChest } from "react-icons/gi";
// import {
//   FaClock,
//   FaExclamationTriangle,
//   FaTimes,
//   FaCheck,
// } from "react-icons/fa";

// const STORAGE_CHEST = "daily_quest_chest_claim_v1";

// const DailyQuest = () => {
//   const exercises = [
//     "Push-ups",
//     "Pull-ups",
//     "Crunches",
//     "Burpees",
//     "Plank",
//     "Sit-ups",
//     "Jumping Jacks",
//     "Lunges",
//   ];

//   const getRandomQuests = () => {
//     const shuffled = [...exercises].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 3).map((ex) => {
//       const exp = Math.floor(Math.random() * 21) + 10;
//       const duration =
//         ex === "Plank" ? 45 : `${Math.floor(Math.random() * 20) + 10}`;
//       return { name: ex, exp, duration, completed: false, started: false, failed: false };
//     });
//   };

//   const [quests, setQuests] = useState([]);
//   const [exp, setExp] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [stats, setStats] = useState({ strength: 0, stamina: 0, agility: 0 });
//   const [chestOpened, setChestOpened] = useState(false);
//   const [chestClaimedDate, setChestClaimedDate] = useState(null);
//   const [timer, setTimer] = useState(null);
//   const [activeQuest, setActiveQuest] = useState(null);
//   const [activeStartDuration, setActiveStartDuration] = useState(null); // store starting duration for the active plank
//   const [isPlankReady, setIsPlankReady] = useState(false); // true when timer reached 0 and user must "Finish"
//   const [popup, setPopup] = useState(null);
//   const [toast, setToast] = useState(null);
//   const toastRef = useRef(null);

//   const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

//   const pushToast = (txt) => {
//     setToast(txt);
//     if (toastRef.current) clearTimeout(toastRef.current);
//     toastRef.current = setTimeout(() => setToast(null), 3500);
//   };

//   useEffect(() => {
//     const savedDate = localStorage.getItem(STORAGE_CHEST);
//     setChestClaimedDate(savedDate || null);
//     setChestOpened(savedDate === todayKey);
//     setQuests(getRandomQuests());
//   }, [todayKey]);

//   useEffect(() => {
//     // When timer reaches 0, mark the plank "ready" for the user to finish (do not auto-complete)
//     if (timer === 0 && activeQuest !== null) {
//       setIsPlankReady(true);
//       setTimer(0); 
//       pushToast("Plank time reached — tap Finish to claim rewards.");
//       return;
//     }
//     if (timer > 0) {
//       const id = setInterval(() => setTimer((t) => (t == null ? null : t - 1)), 1000);
//       return () => clearInterval(id);
//     }
//   }, [timer, activeQuest]);

//   const startQuest = (index) => {
//     if (activeQuest !== null) {
//       pushToast("Finish current quest before starting another.");
//       return;
//     }
//     const q = quests[index];
//     if (!q) return;
//     if (q.name === "Plank") {
//       setQuests((prev) => {
//         const copy = [...prev];
//         copy[index] = { ...copy[index], started: true, failed: false };
//         return copy;
//       });
//       setActiveQuest(index);
//       // store start-duration so we can compute elapsed later
//       const dur = Number(q.duration);
//       setActiveStartDuration(dur);
//       setTimer(dur);
//       setIsPlankReady(false);
//       pushToast("Plank started — hold steady!");
//     } else {
//       setQuests((prev) => {
//         const copy = [...prev];
//         copy[index] = { ...copy[index], completed: true };
//         return copy;
//       });
//       pushToast(`${q.name} completed!`);
//     }
//   };

//   const openChest = () => {
//     // require all quests completed and none failed
//     const allCompleted = quests.length > 0 && quests.every((q) => q.completed && !q.failed);
//     if (!allCompleted || chestClaimedDate === todayKey) {
//       setPopup("warning");
//       return;
//     }

//     const totalExp = quests.reduce((s, q) => s + q.exp, 0);
//     const newExp = exp + totalExp;
//     const statKeys = Object.keys(stats);
//     const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
//     setStats((s) => ({ ...s, [randomStat]: s[randomStat] + 1 }));

//     if (newExp >= level * 100) {
//       setLevel((l) => l + 1);
//       setExp(newExp - level * 100);
//     } else setExp(newExp);

//     localStorage.setItem(STORAGE_CHEST, todayKey);
//     setChestClaimedDate(todayKey);
//     setChestOpened(true);
//     setPopup("reward");
//     pushToast("Chest opened — rewards claimed!");
//   };

//   const cancelPlank = () => {
//     if (activeQuest === null) return;
//     // If plank has already reached completion time (isPlankReady), cancelling should just close modal without marking failed
//     if (isPlankReady) {
//       setActiveQuest(null);
//       setActiveStartDuration(null);
//       setTimer(null);
//       setIsPlankReady(false);
//       pushToast("Closed");
//       return;
//     }
//     // compute elapsed time before cancel: elapsed = startedDuration - remaining timer
//     const startedDur = activeStartDuration ?? (quests[activeQuest]?.duration ?? 0);
//     const elapsed = startedDur - (timer ?? 0);
//     setQuests((prev) => {
//       const copy = [...prev];
//       // mark this quest as failed and clear started flag
//       copy[activeQuest] = { ...copy[activeQuest], started: false, failed: true, completed: false };
//       return copy;
//     });
//     setActiveQuest(null);
//     setActiveStartDuration(null);
//     setTimer(null);
//     pushToast(`Plank canceled — marked failed after ${Math.max(0, Math.round(elapsed))}s`);
//   };

//   // Finish handler: apply completion/bonus and close modal (only shown when isPlankReady === true)
//   const finishPlank = () => {
//     if (activeQuest === null) return;
//     const elapsed = activeStartDuration ?? (quests[activeQuest]?.duration ?? 0);
//     setQuests((prev) => {
//       const copy = [...prev];
//       const q = { ...copy[activeQuest] };
//       q.completed = true;
//       q.started = false;
//       q.failed = false;
//       if (elapsed > 40) {
//         const bonus = Math.round(q.exp * 0.5) || 10;
//         q.exp = q.exp + bonus;
//       }
//       copy[activeQuest] = q;
//       return copy;
//     });
//     setActiveQuest(null);
//     setActiveStartDuration(null);
//     setTimer(null);
//     setIsPlankReady(false);
//     pushToast("Plank finished! Rewards applied.");
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 500,
//         width: "95%",
//         margin: "0 auto",
//         background:
//           "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
//         borderRadius: 20,
//         padding: "2rem",
//         color: "#fff",
//         boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
//         border: "1px solid rgba(255,255,255,0.05)",
//         backdropFilter: "blur(12px)",
//         display: "flex",
//         flexDirection: "column",
//         gap: "1.5rem",
//       }}
//     >
//       <motion.div
//         style={{
//           width: "100%",
//           maxWidth: 460,
//           display: "flex",
//           flexDirection: "column",
//           gap: 16,
//         }}
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               fontWeight: 800,
//               color: "#fbbf24",
//               fontSize: 18,
//             }}
//           >
//             <GiTreasureMap /> Daily Quests
//           </div>
//         </div>

//         {/* Quests List */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {quests.map((q, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.02 }}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 padding: "10px 12px",
//                 borderRadius: 12,
//                 border: q.completed
//                   ? "1px solid rgba(34,197,94,0.7)"
//                   : q.failed
//                   ? "1px solid rgba(239,68,68,0.7)"
//                   : "1px solid rgba(148,163,184,0.06)",
//                 background: q.completed
//                   ? "linear-gradient(90deg,#052e21,#083d2a)"
//                   : q.failed
//                   ? "linear-gradient(90deg,#3b0a0a,#2b0a0a)" 
//                   : "rgba(255,255,255,0.02)",
//                 color: q.completed ? "#dcfce7" : q.failed ? "#ffd7d7" : "#e6eefb",
//               }}
//             >
//               <div>
//                 <div style={{ fontWeight: 500 }}>{q.name}</div>
//                 <div style={{ fontSize: 12, color: "#94a3b8" }}>
//                   {q.name === "Plank" ? `${q.duration}s` : `${q.duration} reps`}
//                 </div>
//               </div>
//               <div>
//                 {q.completed ? (
//                   <button
//                     disabled
//                     style={{
//                       background: "rgba(148,163,184,0.12)",
//                       color: "#93a3b8",
//                       padding: "6px 12px",
//                       borderRadius: 10,
//                       border: "none",
//                       fontWeight: 800,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                       cursor: "not-allowed",
//                     }}
//                   >
//                     <FaCheck /> Done
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => startQuest(i)}
//                     disabled={!!activeQuest}
//                     style={{
//                       background: !!activeQuest ? "rgba(148,163,184,0.12)" : "#f59e0b",
//                       color: !!activeQuest ? "#93a3b8" : "#07121a",
//                       padding: "6px 12px",
//                       borderRadius: 10,
//                       border: "none",
//                       fontWeight: 800,
//                       cursor: !!activeQuest ? "not-allowed" : "pointer",
//                     }}
//                   >
//                     {q.name === "Plank" && q.started ? "In Progress" : q.failed ? "Retry" : "Start"}
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Chest Button */}
//         <button
//           onClick={openChest}
//           disabled={chestClaimedDate === todayKey}
//           style={{
//             width: "100%",
//             padding: "12px 14px",
//             borderRadius: 12,
//             fontWeight: 900,
//             background: chestClaimedDate === todayKey ? "#374151" : "#10b981",
//             color: chestClaimedDate === todayKey ? "#9ca3af" : "#001f14",
//             border: "none",
//             cursor: chestClaimedDate === todayKey ? "not-allowed" : "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 10,
//           }}
//         >
//           <GiChest size={20} />{" "}
//           {chestClaimedDate === todayKey
//             ? "Reward Claimed Today"
//             : chestOpened
//             ? "Chest Opened!"
//             : "Open Reward Chest"}
//         </button>
//       </motion.div>

//       {/* Plank Timer Modal */}
//       {activeQuest !== null && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "rgba(2,6,23,0.7)",
//             zIndex: 99,
//             padding: 16,
//           }}
//         >
//           <motion.div
//             style={{
//               width: "100%",
//               maxWidth: 420,
//               background: "#071022",
//               borderRadius: 14,
//               padding: 18,
//               textAlign: "center",
//               border: "1px solid rgba(245,158,11,0.12)",
//               boxShadow: "0 12px 38px rgba(2,6,23,0.6)",
//               color: "#e6eefb",
//               position: "relative",
//             }}
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//           >
//             <button
//               onClick={cancelPlank}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 10,
//                 border: "none",
//                 background: "transparent",
//                 color: "#94a3b8",
//                 cursor: "pointer",
//               }}
//             >
//               <FaTimes />
//             </button>
//             <FaClock size={44} style={{ color: "#fbbf24", marginBottom: 8 }} />
//             <div style={{ fontWeight: 900, marginBottom: 6 }}>
//               Plank Challenge
//             </div>
//             <div
//               style={{
//                 fontSize: 44,
//                 fontWeight: 900,
//                 color: "#e6eefb",
//                 marginBottom: 4,
//               }}
//             >
//               {timer ?? "—"}
//             </div>
//             <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
//               seconds
//             </div>
//             <div
//               style={{
//                 width: "100%",
//                 height: 10,
//                 background: "#091226",
//                 borderRadius: 999,
//                 overflow: "hidden",
//                 marginBottom: 12,
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   background: "#10b981",
//                   width: `${
//                     timer !== null && quests[activeQuest]
//                       ? Math.max(
//                           0,
//                           ((quests[activeQuest].duration - timer) /
//                             quests[activeQuest].duration) *
//                             100,
//                         )
//                       : 0
//                   }%`,
//                   transition: "width 0.2s linear",
//                 }}
//               />
//             </div>
//             <div style={{ fontSize: 13, color: "#9ca3baf", marginBottom: 8 }}>
//               {isPlankReady ? "Plank time complete — tap Finish to claim rewards." : "Hold steady until the timer ends."}
//             </div>
//             <div style={{ display: "flex", gap: 10 }}>
//               {/* Show Cancel while counting down; when ready show Finish button instead */}
//               {!isPlankReady ? (
//                 <button
//                   onClick={cancelPlank}
//                   style={{
//                     flex: 1,
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#ef4444",
//                     border: "none",
//                     color: "#fff",
//                     fontWeight: 800,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               ) : (
//                 <button
//                   onClick={finishPlank}
//                   style={{
//                     flex: 1,
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#10b981",
//                     border: "none",
//                     color: "#062e25",
//                     fontWeight: 800,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Finish
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Popup Modal */}
//       {popup && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "rgba(2,6,23,0.7)",
//             zIndex: 99,
//             padding: 16,
//           }}
//         >
//           <motion.div
//             style={{
//               width: "100%",
//               maxWidth: 420,
//               background: "#071022",
//               borderRadius: 14,
//               padding: 18,
//               textAlign: "center",
//               color: "#e6eefb",
//             }}
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//           >
//             {popup === "reward" ? (
//               <>
//                 <GiChest
//                   size={36}
//                   style={{ color: "#fbbf24", marginBottom: 8 }}
//                 />
//                 <div style={{ fontWeight: 900, marginBottom: 6 }}>
//                   Chest Opened!
//                 </div>
//                 <div
//                   style={{ color: "#fbbf24", fontWeight: 800, marginBottom: 8 }}
//                 >
//                   Rewards Gained 🎁
//                 </div>
//                 <div style={{ marginBottom: 4 }}>
//                   +{quests.reduce((s, q) => s + q.exp, 0)} EXP
//                 </div>
//                 <div>+1 Random Stat</div>
//               </>
//             ) : (
//               <>
//                 <FaExclamationTriangle
//                   size={36}
//                   style={{ color: "#ef4444", marginBottom: 8 }}
//                 />
//                 <div style={{ fontWeight: 900, marginBottom: 6 }}>Warning</div>
//                 <div style={{ color: "#94a3b8" }}>
//                   {chestClaimedDate === todayKey
//                     ? "Reward already claimed today!"
//                     : "Complete all quests first!"}
//                 </div>
//               </>
//             )}
//             <div style={{ marginTop: 12 }}>
//               <button
//                 onClick={() => setPopup(null)}
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: 8,
//                   background: "#f59e0b",
//                   border: "none",
//                   fontWeight: 800,
//                   cursor: "pointer",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Toast */}
//       {/* {toast && (
//         <motion.div
//           initial={{ opacity: 0, y: -8 }}
//           animate={{ opacity: 1, y: 0 }}
//           style={{
//             display: "flex",
//             position: "fixed",
//             top: 17,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "#05202a",
//             color: "#dbeafe",
//             padding: "8px 14px",
//             borderRadius: 10,
//             boxShadow: "0 8px 24px rgba(2,6,23,0.6)",
//             zIndex: 120,
//           }}
//         >
//           {toast}
//         </motion.div>
//       )} */}
//     </div>
//   );
// };

// export default DailyQuest; 



// import React, { useState, useEffect, useRef } from "react";
// import { FaComments, FaTimes } from "react-icons/fa";

// const FitBot = () => {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const sendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage = { sender: "user", text: input };
//     const newMessages = [...chat, userMessage];
//     setChat(newMessages);
//     setInput("");
//     setIsLoading(true);

//     const botMsgId = Date.now();
//     // Add a placeholder for the bot's response
//     setChat((prev) => [...prev, { id: botMsgId, sender: "bot", text: "..." }]);

//     try {
//       const history = newMessages
//         .filter(msg => msg.id !== botMsgId) // Exclude placeholder
//         .map((msg) => ({
//         role: msg.sender === "user" ? "user" : "model",
//         parts: [{ text: msg.text }],
//       }));

//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: input, history }),
//       });

//       if (!response.ok || !response.body) throw new Error("Server error");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let responseText = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         responseText += decoder.decode(value, { stream: true });
//         setChat((prev) => prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: responseText } : msg)));
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setChat((prev) => prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: "Sorry, something went wrong." } : msg)));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       <div
//         onClick={() => setOpen(!open)}
//         style={{
//           position: "fixed",
//           bottom: "7rem", // Adjusted to be above the nav bar
//           right: "2rem",
//           background: "#2563eb",
//           color: "white",
//           borderRadius: "50%",
//           width: "60px",
//           height: "60px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
//           cursor: "pointer",
//           zIndex: 1000,
//         }}
//       >
//         {open ? <FaTimes size={24} /> : <FaComments size={24} />}
//       </div>

//       {/* Chat Window */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "12rem", // Adjusted to be above the button
//             right: "2rem",
//             width: "320px",
//             height: "420px",
//             background: "#f9fafb",
//             border: "1px solid #ddd",
//             borderRadius: "20px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//             overflow: "hidden",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: "#2563eb",
//               color: "white",
//               textAlign: "center",
//               padding: "10px",
//               fontWeight: "bold",
//             }}
//           >
//             🏋️ FitBot - Your Fitness Assistant
//           </div>

//           <div
//             style={{
//               flex: 1,
//               padding: "10px",
//               overflowY: "auto",
//               fontSize: "14px",
//             }}
//           >
//             {chat.map((msg, i) => (
//               <div
//                 key={i}
//                 style={{
//                   textAlign: msg.sender === "user" ? "right" : "left",
//                   margin: "8px 0",
//                 }}
//               >
//                 <span
//                   style={{
//                     display: "inline-block",
//                     background:
//                       msg.sender === "user" ? "#2563eb" : "#e5e7eb",
//                     color: msg.sender === "user" ? "white" : "black",
//                     padding: "8px 10px",
//                     borderRadius: "15px",
//                     maxWidth: "75%",
//                   }}
//                 >
//                   {msg.text}
//                 </span>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div
//             style={{
//               display: "flex",
//               borderTop: "1px solid #ddd",
//               padding: "10px",
//               background: "white",
//             }}
//           >
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Ask about diet or workouts..."
//               style={{
//                 flex: 1,
//                 border: "none",
//                 outline: "none",
//                 color: "black",
//                 fontSize: "14px",
//               }}
//               disabled={isLoading}
//             />
//             <button
//               onClick={sendMessage}
//               disabled={isLoading}
//               style={{
//                 background: "#2563eb",
//                 color: "white",
//                 border: "none",
//                 padding: "6px 12px",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 opacity: isLoading ? 0.5 : 1,
//               }}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default FitBot;


// VITE_CLERK_PUBLISHABLE_KEY="pk_test_c3VwZXJiLWxlb3BhcmQtNy5jbGVyay5hY2NvdW50cy5kZXYk"

// VITE_API_URL= https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyAAcPpUhOOyzgWnEdDk4a1Q3y8P3sdFsbs 

// # VITE_API_URL=http://localhost:5000


// # VITE_GEMINI_API_KEY=AIzaSyAAcPpUhOOyzgWnEdDk4a1Q3y8P3sdFsbs



// # VITE_CLERK_PUBLISHABLE_KEY='pk_test_c3VwZXJiLWxlb3BhcmQtNy5jbGVyay5hY2NvdW50cy5kZXYk'

// VITE_GEMINI_API_KEY=AIzaSyAAcPpUhOOyzgWnEdDk4a1Q3y8P3sdFsbs
// VITE_GEMINI_MODEL_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent


// # VITE_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
// #   -H "x-goog-api-key: $GEMINI_API_KEY






// import React, { useEffect, useState, useRef } from "react";
// import { motion } from "framer-motion";
// import { GiTreasureMap, GiChest } from "react-icons/gi";
// import { FaClock, FaExclamationTriangle, FaTimes, FaCheck } from "react-icons/fa";
// import { useUser } from "@clerk/clerk-react";
// import { updateUserData, getUserData } from "../api/userApi";

// const exercises = [
//   "Push-ups",
//   "Pull-ups",
//   "Crunches",
//   "Burpees",
//   "Plank",
//   "Sit-ups",
//   "Jumping Jacks",
//   "Lunges",
// ];

// const getRandomQuests = () => {
//   const shuffled = [...exercises].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, 3).map((ex) => {
//     const exp = Math.floor(Math.random() * 21) + 10;
//     const duration =
//       ex === "Plank"
//         ? Math.floor(Math.random() * 20) + 10
//         : `${Math.floor(Math.random() * 20) + 10}`;
//     return {
//       name: ex,
//       exp,
//       duration,
//       completed: false,
//       started: false,
//       failed: false,
//     };
//   });
// };

// const getExpForLevel = (lvl) => Math.floor(1000 * Math.pow(1.1, lvl - 1));

// const DailyQuest = () => {
//   const { user, isSignedIn } = useUser();

//   const [isLoading, setIsLoading] = useState(true);
//   const [quests, setQuests] = useState([]);
//   const [chestOpened, setChestOpened] = useState(false);

//   const [xp, setXp] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [stats, setStats] = useState({
//     strength: 0,
//     stamina: 0,
//     agility: 0,
//     endurance: 0,
//     mobility: 0,
//   });


//   const [timer, setTimer] = useState(null);
//   const [activeQuest, setActiveQuest] = useState(null);
//   const [activeStartDuration, setActiveStartDuration] = useState(null);
//   const [isPlankReady, setIsPlankReady] = useState(false);

//   const [popup, setPopup] = useState(null);
//   const [toast, setToast] = useState(null);
//   const toastRef = useRef(null);

//   const pushToast = (txt) => {
//     setToast(txt);
//     if (toastRef.current) clearTimeout(toastRef.current);
//     toastRef.current = setTimeout(() => setToast(null), 3000);
//   };

//   // Effect to load user data from the database
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user?.id) {
//         setIsLoading(true);
//         try {
//           const data = await getUserData(user.id);
//           setLevel(data.level || 1);
//           setXp(data.xp || 0);
//           setStats(
//             data.stats || {
//               strength: 0,
//               stamina: 0,
//               agility: 0,
//               endurance: 0,
//               mobility: 0,
//             }
//           );

//           const today = new Date().toISOString().slice(0, 10);
//           if (data.quests && data.quests.date === today) {
//             setQuests(data.quests.quests);
//             setChestOpened(data.quests.chestOpened);
//           } else {
//             // Generate new quests if no data for today or date mismatch
//             setQuests(getRandomQuests());
//             setChestOpened(false);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user data:", err);
//           // Fallback to generating new quests if fetching fails
//           setQuests(getRandomQuests());
//           setChestOpened(false);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     fetchUserData();
//   }, [user]); // Re-run when user object changes (e.g., after sign-in)


//   useEffect(() => {
//     if (timer === 0 && activeQuest !== null) {
//       setIsPlankReady(true);
//       pushToast("Plank time reached — tap Finish to claim rewards.");
//       return;
//     }
//     if (timer > 0) {
//       const id = setInterval(
//         () => setTimer((t) => (t == null ? null : t - 1)),
//         1000,
//       );
//       return () => clearInterval(id);
//     }
//   }, [timer, activeQuest]);

//   const startQuest = (index) => {
//     if (activeQuest !== null) {
//       pushToast("Finish current quest before starting another.");
//       return;
//     }
//     const q = quests[index];
//     if (!q) return;

//     if (q.name === "Plank") {
//       setQuests((prev) => {
//         const copy = [...prev];
//         copy[index] = { ...copy[index], started: true, failed: false };
//         return copy;
//       });
//       setActiveQuest(index);
//       setActiveStartDuration(Number(q.duration));
//       setTimer(Number(q.duration));
//       setIsPlankReady(false);
//       pushToast("Plank started — hold steady!");
//     } else {
//       setQuests((prev) => {
//         const copy = [...prev];
//         copy[index] = { ...copy[index], completed: true };
//         return copy;
//       });
//     }
//   };


//   const finishPlank = () => {
//     if (activeQuest === null) return;
//     setQuests((prev) => {
//       const copy = [...prev];
//       copy[activeQuest] = {
//         ...copy[activeQuest],
//         completed: true,
//         started: false,
//         failed: false,
//       };
//       return copy;
//     });
//     setActiveQuest(null);
//     setActiveStartDuration(null);
//     setTimer(null);
//     setIsPlankReady(false);
//     pushToast("Plank completed!");
//   };


//   const cancelPlank = () => {
//     if (activeQuest === null) return;
//     if (isPlankReady) {
//       setActiveQuest(null);
//       setTimer(null);
//       setIsPlankReady(false);
//       pushToast("Closed");
//       return;
//     }
//     setQuests((prev) => {
//       const copy = [...prev];
//       copy[activeQuest] = {
//         ...copy[activeQuest],
//         started: false,
//         failed: true,
//         completed: false,
//       };
//       return copy;
//     });
//     setActiveQuest(null);
//     setActiveStartDuration(null);
//     setTimer(null);
//     pushToast("Plank canceled — marked failed.");
//   };
  

//   const openChest = async () => {
//     if (!user || !user.id) {
//       pushToast("User not loaded yet.");
//       return;
//     }

//     if (chestOpened) {
//       setPopup("warning");
//       pushToast("Chest already opened today!");
//       return;
//     }

//     const allCompleted =
//       quests.length > 0 && quests.every((q) => q.completed && !q.failed);

//     if (!allCompleted) {
//       setPopup("warning");
//       pushToast("Complete all quests first!");
//       return;
//     }

//     const totalExp = quests.reduce((s, q) => s + (q.exp || 0), 0);
//     const newExp = (xp || 0) + totalExp;

//     // Random stat
//     const statKeys = Object.keys(stats);
//     const randomStatKey =
//       statKeys[Math.floor(Math.random() * statKeys.length)];

//     const newStats = {
//       ...stats,
//       [randomStatKey]: (stats[randomStatKey] || 0) + 1,
//     };

//     // Leveling system
//     let newLevel = level || 1;
//     let remainingExp = newExp;
//     let expToNext = getExpForLevel(newLevel);

//     while (remainingExp >= expToNext) {
//       remainingExp -= expToNext;
//       newLevel++;
//       expToNext = getExpForLevel(newLevel);
//     }

//     setStats(newStats);
//     setLevel(newLevel);
//     setXp(remainingExp);
//     setChestOpened(true);
//     setPopup("reward");

//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       await updateUserData(user.id, {
//         xp: remainingExp,
//         level: newLevel,
//         stats: newStats,
//         quests: { // Save the daily quest state
//           date: today,
//           quests: quests.map(q => ({ ...q, completed: true })), 
//           chestOpened: true,
//         },
//         "streak.lastActivity": new Date(), 
//       });

//       window.dispatchEvent(new CustomEvent("userProgressUpdated"));
//       window.dispatchEvent(
//         new CustomEvent("statsUpdated", { detail: newStats })
//       );

//       console.log("✅ XP, stats, and daily quests saved to DB");
//     } catch (err) {
//       console.error("Failed to save chest rewards:", err);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         width: "100%",
//         margin: "0",
//         minHeight: 400,
//         background:
//           "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.95))",
//         borderRadius: 20,
//         padding: "1rem 1.3rem",
//         color: "#fff",
//         boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
//         border: "1px solid rgba(255,255,255,0.05)",
//         backdropFilter: "blur(12px)",
//         display: "flex",
//         flexDirection: "column",
//         gap: "1.5rem",
//         alignItems: "center",
//       }}
//     >
//       {isLoading && (
//         <div style={{ color: "#fff", fontSize: "1.5rem" }}>Loading Quests...</div>
//       )}

//       {/* Header */}
//       <motion.div
//         style={{
//           width: "100%",
//           maxWidth: 530,
//           display: "flex",
//           flexDirection: "column",
//           gap: 16,
//         }}
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
//         transition={{ duration: 0.6, delay: isLoading ? 0 : 0.2 }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               fontWeight: 800,
//               color: "#4178f0ff",
//               fontSize: 22,
//             }}
//           >
//             <GiTreasureMap /> Daily Quests
//           </div>
//         </div>

//         {/* Quest List - Only render if not loading */}
//         {!isLoading && (
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {quests.map((q, i) => (
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 padding: "8px 10px",
//                 borderRadius: 12,
//                 height: 60,
//                 border: q.completed
//                   ? "1px solid rgba(34,197,94,0.7)"
//                   : q.failed
//                   ? "1px solid rgba(239,68,68,0.7)"
//                   : "1px solid rgba(148,163,184,0.06)",
//                 background: q.completed
//                   ? "linear-gradient(90deg,#052e21,#083d2a)"
//                   : q.failed
//                   ? "linear-gradient(90deg,#3b0a0a,#2b0a0a)"
//                   : "rgba(255,255,255,0.02)",
//                 color: q.completed
//                   ? "#dcfce7"
//                   : q.failed
//                   ? "#ffd7d7"
//                   : "#e6eefb",
//               }}
//             >
//               <div>
//                 <div style={{ fontSize: "1.3rem", fontWeight: 500 }}>
//                   {q.name}
//                 </div>
//                 <div style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
//                   {q.name === "Plank" ? `${q.duration}s` : `${q.duration} reps`}
//                 </div>
//               </div>
//               <div>
//                 {q.completed ? (
//                   <button
//                     disabled
//                     style={{
//                       background: "rgba(148,163,184,0.12)",
//                       color: "#93a3b8",
//                       padding: "6px 8px",
//                       borderRadius: 10,
//                       border: "none",
//                       fontSize: "1.2rem",
//                       fontWeight: 600,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                       cursor: "not-allowed",
//                     }}
//                   >
//                     <FaCheck /> Done
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => startQuest(i)}
//                     disabled={!!activeQuest}
//                     style={{
//                       color: !!activeQuest ? "#93a3b8" : "#ffffffff",
//                       padding: "0.4rem 1rem",
//                       border: "1px solid #0bdcf8ff ",
//                       borderRadius: 10,
//                       fontSize: "1.3rem",
//                       fontWeight: 600,
//                       cursor: !!activeQuest ? "not-allowed" : "pointer",
//                     }}
//                     onMouseOver={(e) => {
//                       e.currentTarget.style.background =
//                         "linear-gradient(90deg, #1e3a8a, #06b6d4)";
//                       e.currentTarget.style.boxShadow = "0 0 12px #06b6d4";
//                     }}
//                     onMouseOut={(e) => {
//                       e.currentTarget.style.background = "#02013b";
//                       e.currentTarget.style.boxShadow = "none";
//                     }}
//                   >
//                     {q.name === "Plank" && q.started
//                       ? "In Progress"
//                       : q.failed
//                       ? "Retry"
//                       : "Start"}
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//         )}

//         {/* Open Chest Button */}
//         <button
//           onClick={openChest}
//           style={{
//             width: "100%",
//             padding: "0.5rem 1rem",
//             borderRadius: 12,
//             fontWeight: 700,
//             fontSize: "1.5rem",
//             background: chestOpened
//               ? "#374151"
//               : "linear-gradient(90deg, #93a8e2ff, #06b6d4)",
//             color: chestOpened ? "#9ca3af" : "#001f14",
//             border: "none",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 10,
//           }}
//           disabled={isLoading} // Disable button while loading
//         >
//           <GiChest size={26} /> {chestOpened ? "Chest Opened!" : "Open Chest"}
//         </button>
//       </motion.div>

//       {/* Plank Modal */}
//       {activeQuest !== null && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "rgba(2,6,23,0.7)",
//             zIndex: 99,
//             padding: 16,
//           }}
//         >
//           <motion.div
//             style={{
//               width: "100%",
//               maxWidth: 420,
//               background: "#071022",
//               borderRadius: 14,
//               padding: 18,
//               textAlign: "center",
//               border: "1px solid rgba(245,158,11,0.12)",
//               boxShadow: "0 12px 38px rgba(2,6,23,0.6)",
//               color: "#e6eefb",
//               position: "relative",
//             }}
//             initial={{ scale: 0.95, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//           >
//             <button
//               onClick={cancelPlank}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 10,
//                 border: "none",
//                 background: "transparent",
//                 color: "#94a3b8",
//                 cursor: "pointer",
//               }}
//             >
//               <FaTimes />
//             </button>
//             <FaClock size={44} style={{ color: "#fbbf24", marginBottom: 8 }} />
//             <div style={{ fontWeight: 900, marginBottom: 6 }}>
//               Plank Challenge
//             </div>
//             <div
//               style={{
//                 fontSize: 44,
//                 fontWeight: 900,
//                 color: "#e6eefb",
//                 marginBottom: 4,
//               }}
//             >
//               {timer ?? "—"}
//             </div>
//             <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
//               seconds
//             </div>
//             <div
//               style={{
//                 width: "100%",
//                 height: 10,
//                 background: "#091226",
//                 borderRadius: 999,
//                 overflow: "hidden",
//                 marginBottom: 12,
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   background: "#10b981",
//                   width: `${
//                     timer !== null && quests[activeQuest]
//                       ? Math.max(
//                           0,
//                           ((quests[activeQuest].duration - timer) /
//                             quests[activeQuest].duration) *
//                             100,
//                         )
//                       : 0
//                   }%`,
//                   transition: "width 0.2s linear",
//                 }}
//               />
//             </div>
//             <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
//               {isPlankReady
//                 ? "Plank time complete — tap Finish to claim rewards."
//                 : "Hold steady until the timer ends."}
//             </div>
//             <div style={{ display: "flex", gap: 10 }}>
//               {!isPlankReady ? (
//                 <button
//                   onClick={cancelPlank}
//                   style={{
//                     flex: 1,
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#ef4444",
//                     border: "none",
//                     color: "#fff",
//                     fontWeight: 800,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               ) : (
//                 <button
//                   onClick={finishPlank}
//                   style={{
//                     flex: 1,
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#10b981",
//                     border: "none",
//                     color: "#062e25",
//                     fontWeight: 800,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Finish
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Popup */}
//       {popup && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "rgba(2,6,23,0.7)",
//             zIndex: 99,
//             padding: 16,
//           }}
//         >
//           <motion.div
//             style={{
//               gap: "2rem",
//               background: "#00002e7b",
//               backdropFilter: "blur(2px)",
//               padding: "1rem",
//               border: "1px solid #0bdcf8ff",
//               borderRadius: "1rem",
//               maxWidth: "350px",
//               width: "90%",
//               height: "16rem",
//               textAlign: "center",
//               color: "#fff",
//               boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
//             }}
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//           >
//             {popup === "reward" ? (
//               <>
//                 <GiChest
//                   size={36}
//                   style={{ color: "#fbbf24", marginBottom: 8 }}
//                 />
//                 <div style={{ fontWeight: 900, marginBottom: 6 }}>
//                   Chest Opened!
//                 </div>
//                 <div
//                   style={{ color: "#fbbf24", fontWeight: 800, marginBottom: 8 }}
//                 >
//                   Rewards Gained 🎁
//                 </div>
//                 <div style={{ marginBottom: 4 }}>{`+${quests.reduce(
//                   (s, q) => s + q.exp,
//                   0,
//                 )} EXP`}</div>
//                 <div>+1 Random Stat</div>
//               </>
//             ) : (
//               <>
//                 <FaExclamationTriangle
//                   size={36}
//                   style={{ color: "#ef4444", marginBottom: 8 }}
//                 />
//                 <div style={{ fontWeight: 900, marginBottom: 6 }}>Warning</div>
//                 <div style={{ color: "#94a3b8" }}>
//                   {chestOpened
//                     ? "Reward already claimed!"
//                     : "Complete all quests first!"}
//                 </div>
//               </>
//             )}
//             <div style={{ marginTop: 12 }}>
//               <button
//                 onClick={() => setPopup(null)}
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: 8,
//                   background: "#f59e0b",
//                   border: "none",
//                   fontWeight: 800,
//                   cursor: "pointer",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <motion.div
//           initial={{ opacity: 0, y: -8 }}
//           animate={{ opacity: 1, y: 0 }}
//           style={{
//             position: "fixed",
//             top: 17,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "#05202a",
//             color: "#dbeafe",
//             padding: "8px 14px",
//             borderRadius: 10,
//             boxShadow: "0 8px 24px rgba(2,6,23,0.6)",
//             zIndex: 120,
//           }}
//         >
//           {toast}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default DailyQuest;
