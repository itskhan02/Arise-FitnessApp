// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { GiTreasureMap, GiChest } from "react-icons/gi";
// import { FaClock, FaExclamationTriangle, FaTimes, FaCheck } from "react-icons/fa";

// const QUEST_HISTORY_KEY = "quest_history";
// const USER_PROGRESS_KEY = "user_progress_history";
// const DAILY_QUEST_DATA_KEY = "daily_quest_data";

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
//         ex === "Plank"
//           ? Math.floor(Math.random() * 20) + 10
//           : `${Math.floor(Math.random() * 20) + 10}`;
//       return {
//         name: ex,
//         exp,
//         duration,
//         completed: false,
//         started: false,
//         failed: false,
//       };
//     });
//   };

//   const [quests, setQuests] = useState([]);
//   const [exp, setExp] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [stats, setStats] = useState({
//     strength: 0,
//     stamina: 0,
//     agility: 0,
//     endurance: 0,
//     mobility: 0,
//   });
//   const [chestOpened, setChestOpened] = useState(false);
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
//     toastRef.current = setTimeout(() => setToast(null), 3500);
//   };

//   const addQuestToHistory = (questName) => {
//     const today = new Date().toISOString().slice(0, 10);
//     const history = JSON.parse(localStorage.getItem(QUEST_HISTORY_KEY)) || {};
//     if (!history[today]) history[today] = [];
//     if (!history[today].includes(questName)) history[today].push(questName);
//     localStorage.setItem(QUEST_HISTORY_KEY, JSON.stringify(history));
//   };

//   const saveDailyQuestData = (questsToSave, chestStatus) => {
//     const today = new Date().toISOString().slice(0, 10);
//     const data = {
//       date: today,
//       quests: questsToSave,
//       chestOpened: chestStatus,
//     };
//     localStorage.setItem(DAILY_QUEST_DATA_KEY, JSON.stringify(data));
//   };

//   useEffect(() => {
//     const today = new Date().toISOString().slice(0, 10);
//     const dailyDataRaw = localStorage.getItem(DAILY_QUEST_DATA_KEY);
//     if (dailyDataRaw) {
//       const dailyData = JSON.parse(dailyDataRaw);
//       if (dailyData.date === today) {
//         setQuests(dailyData.quests);
//         setChestOpened(dailyData.chestOpened);
//         return;
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const progressHistoryRaw = localStorage.getItem(USER_PROGRESS_KEY);
//     if (progressHistoryRaw) {
//       const progressHistory = JSON.parse(progressHistoryRaw);
//       const allDates = Object.keys(progressHistory).sort();
//       if (allDates.length > 0) {
//         const latestDate = allDates[allDates.length - 1];
//         const latestProgress = progressHistory[latestDate];
//         if (latestProgress) {
//           setLevel(latestProgress.level || 1);
//           setExp(latestProgress.exp || 0);
//           setStats(
//             latestProgress.stats || {
//               strength: 0,
//               stamina: 0,
//               agility: 0,
//               endurance: 0,
//               mobility: 0,
//             }
//           );
//         }
//       }
//     }
//     setQuests((prevQuests) => {
//       if (prevQuests.length === 0) {
//         return getRandomQuests();
//       }
//       return prevQuests;
//     });
//   }, []);

//   useEffect(() => {
//     if (timer === 0 && activeQuest !== null) {
//       setIsPlankReady(true);
//       setTimer(0);
//       pushToast("Plank time reached — tap Finish to claim rewards.");
//       return;
//     }
//     if (timer > 0) {
//       const id = setInterval(
//         () => setTimer((t) => (t == null ? null : t - 1)),
//         1000
//       );
//       return () => clearInterval(id);
//     }
//   }, [timer, activeQuest]);

//   // Persist quest state whenever it changes
//   useEffect(() => {
//     if (quests.length > 0) {
//       saveDailyQuestData(quests, chestOpened);
//     }
//   }, [quests, chestOpened]);

//   const saveProgress = (newLevel, newExp, newStats) => {
//     const today = new Date().toISOString().slice(0, 10);
//     const progressHistory =
//       JSON.parse(localStorage.getItem(USER_PROGRESS_KEY)) || {};

//     progressHistory[today] = {
//       level: newLevel,
//       exp: newExp,
//       stats: newStats,
//     };

//     localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressHistory));
//     window.dispatchEvent(new CustomEvent("userProgressUpdated"));
//   };

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
//       addQuestToHistory(q.name);
//       pushToast(`${q.name} completed!`);
//     }
//   };

//   const openChest = () => {
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

//     const totalExp = quests.reduce((s, q) => s + q.exp, 0);
//     const newExp = exp + totalExp;

//     const statKeys = Object.keys(stats);
//     const randomStatKey = statKeys[Math.floor(Math.random() * statKeys.length)];
//     const newStats = { ...stats, [randomStatKey]: stats[randomStatKey] + 1 };

//     const getExpForLevel = (level) =>
//       Math.floor(1000 * Math.pow(1.1, level - 1));
//     let newLevel = level;
//     let remainingExp = newExp;
//     let expToNext = getExpForLevel(newLevel);

//     while (remainingExp >= expToNext) {
//       remainingExp -= expToNext;
//       newLevel++;
//       expToNext = getExpForLevel(newLevel);
//     }

//     setStats(newStats);
//     setLevel(newLevel);
//     setExp(remainingExp);
//     setChestOpened(true);
//     setPopup("reward");
//     saveDailyQuestData(quests, true); // Explicitly save chest state
//     pushToast("Chest opened — XP & stat gained!");
//     saveProgress(newLevel, remainingExp, newStats);
//   };

//   const cancelPlank = () => {
//     if (activeQuest === null) return;
//     if (isPlankReady) {
//       setActiveQuest(null);
//       setActiveStartDuration(null);
//       setTimer(null);
//       setIsPlankReady(false);
//       pushToast("Closed");
//       return;
//     }
//     const startedDur =
//       activeStartDuration ?? quests[activeQuest]?.duration ?? 0;
//     const elapsed = startedDur - (timer ?? 0);
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
//     pushToast(
//       `Plank canceled — marked failed after ${Math.max(
//         0,
//         Math.round(elapsed)
//       )}s`
//     );
//   };

//   const finishPlank = () => {
//     if (activeQuest === null) return;
//     const elapsed = activeStartDuration ?? quests[activeQuest]?.duration ?? 0;
//     setQuests((prev) => {
//       const copy = [...prev];
//       const q = { ...copy[activeQuest] };
//       q.completed = true;
//       q.started = false;
//       q.failed = false;
//       copy[activeQuest] = q;
//       return copy;
//     });
//     addQuestToHistory(quests[activeQuest].name);
//     setActiveQuest(null);
//     setActiveStartDuration(null);
//     setTimer(null);
//     setIsPlankReady(false);
//     pushToast("Plank completed!");
//   };


//   return (
//     <div 
//       style={{
//         maxWidth: 600,
//         width: "100%",
//         margin: "0 ",
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
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
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

//         {/* Quest List */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {quests.map((q, i) => (
//             <motion.div
//               key={i}
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
//                       // background: !!activeQuest
//                       //   ? "rgba(148,163,184,0.12)"
//                       //   : "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
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
//         >
//           <GiChest size={26} /> {chestOpened ? "Chest Opened!" : "Open Chest"}
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
//             fontSize: "1.2rem",
//             gap: "1rem",
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
//       {/* {toast && (
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
//       )} */}
//     </div>
//   );
// };

// export default DailyQuest;




/*---------------test version-----------------*/


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GiTreasureMap, GiChest } from "react-icons/gi";
import { FaClock, FaExclamationTriangle, FaTimes, FaCheck } from "react-icons/fa";

const QUEST_HISTORY_KEY = "quest_history";
const USER_PROGRESS_KEY = "user_progress_history";

const DailyQuest = () => {
  const exercises = [
    "Push-ups",
    "Pull-ups",
    "Crunches",
    "Burpees",
    "Plank",
    "Sit-ups",
    "Jumping Jacks",
    "Lunges",
  ];

  const getRandomQuests = () => {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((ex) => {
      const exp = Math.floor(Math.random() * 21) + 10;
      const duration =
        ex === "Plank"
          ? Math.floor(Math.random() * 20) + 10
          : `${Math.floor(Math.random() * 20) + 10}`;
      return {
        name: ex,
        exp,
        duration,
        completed: false,
        started: false,
        failed: false,
      };
    });
  };

  const [quests, setQuests] = useState([]);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState({
    strength: 0,
    stamina: 0,
    agility: 0,
    endurance: 0,
    mobility: 0,
  });
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

  const addQuestToHistory = (questName) => {
    const today = new Date().toISOString().slice(0, 10);
    const history = JSON.parse(localStorage.getItem(QUEST_HISTORY_KEY)) || {};
    if (!history[today]) history[today] = [];
    if (!history[today].includes(questName)) history[today].push(questName);
    localStorage.setItem(QUEST_HISTORY_KEY, JSON.stringify(history));
  };

  useEffect(() => {
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
          setStats(
            latestProgress.stats || {
              strength: 0,
              stamina: 0,
              agility: 0,
              endurance: 0,
              mobility: 0,
            }
          );
        }
      }
    }
    setQuests(getRandomQuests());
  }, []);

  useEffect(() => {
    if (timer === 0 && activeQuest !== null) {
      setIsPlankReady(true);
      setTimer(0);
      pushToast("Plank time reached — tap Finish to claim rewards.");
      return;
    }
    if (timer > 0) {
      const id = setInterval(
        () => setTimer((t) => (t == null ? null : t - 1)),
        1000
      );
      return () => clearInterval(id);
    }
  }, [timer, activeQuest]);

  const saveProgress = (newLevel, newExp, newStats) => {
    const today = new Date().toISOString().slice(0, 10);
    const progressHistory =
      JSON.parse(localStorage.getItem(USER_PROGRESS_KEY)) || {};

    progressHistory[today] = {
      level: newLevel,
      exp: newExp,
      stats: newStats,
    };

    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressHistory));
    window.dispatchEvent(new CustomEvent("userProgressUpdated"));
  };

  const startQuest = (index) => {
    if (activeQuest !== null) {
      pushToast("Finish current quest before starting another.");
      return;
    }
    const q = quests[index];
    if (!q) return;

    if (q.name === "Plank") {
      setQuests((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], started: true, failed: false };
        return copy;
      });
      setActiveQuest(index);
      setActiveStartDuration(Number(q.duration));
      setTimer(Number(q.duration));
      setIsPlankReady(false);
      pushToast("Plank started — hold steady!");
    } else {
      setQuests((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], completed: true };
        return copy;
      });
      addQuestToHistory(q.name);
      pushToast(`${q.name} completed!`);
    }
  };

  const openChest = () => {
    if (chestOpened) {
      setPopup("warning");
      pushToast("Chest already opened today!");
      return;
    }

    const allCompleted =
      quests.length > 0 && quests.every((q) => q.completed && !q.failed);
    if (!allCompleted) {
      setPopup("warning");
      pushToast("Complete all quests first!");
      return;
    }

    const totalExp = quests.reduce((s, q) => s + q.exp, 0);
    const newExp = exp + totalExp;

    const statKeys = Object.keys(stats);
    const randomStatKey = statKeys[Math.floor(Math.random() * statKeys.length)];
    const newStats = { ...stats, [randomStatKey]: stats[randomStatKey] + 1 };

    const getExpForLevel = (level) =>
      Math.floor(1000 * Math.pow(1.1, level - 1));
    let newLevel = level;
    let remainingExp = newExp;
    let expToNext = getExpForLevel(newLevel);

    while (remainingExp >= expToNext) {
      remainingExp -= expToNext;
      newLevel++;
      expToNext = getExpForLevel(newLevel);
    }

    setStats(newStats);
    setLevel(newLevel);
    setExp(remainingExp);
    setChestOpened(true);
    setPopup("reward");
    pushToast("Chest opened — XP & stat gained!");
    saveProgress(newLevel, remainingExp, newStats);
  };

  const cancelPlank = () => {
    if (activeQuest === null) return;
    if (isPlankReady) {
      setActiveQuest(null);
      setActiveStartDuration(null);
      setTimer(null);
      setIsPlankReady(false);
      pushToast("Closed");
      return;
    }
    const startedDur =
      activeStartDuration ?? quests[activeQuest]?.duration ?? 0;
    const elapsed = startedDur - (timer ?? 0);
    setQuests((prev) => {
      const copy = [...prev];
      copy[activeQuest] = {
        ...copy[activeQuest],
        started: false,
        failed: true,
        completed: false,
      };
      return copy;
    });
    setActiveQuest(null);
    setActiveStartDuration(null);
    setTimer(null);
    pushToast(
      `Plank canceled — marked failed after ${Math.max(
        0,
        Math.round(elapsed)
      )}s`
    );
  };

  const finishPlank = () => {
    if (activeQuest === null) return;
    const elapsed = activeStartDuration ?? quests[activeQuest]?.duration ?? 0;
    setQuests((prev) => {
      const copy = [...prev];
      const q = { ...copy[activeQuest] };
      q.completed = true;
      q.started = false;
      q.failed = false;
      copy[activeQuest] = q;
      return copy;
    });
    addQuestToHistory(quests[activeQuest].name);
    setActiveQuest(null);
    setActiveStartDuration(null);
    setTimer(null);
    setIsPlankReady(false);
    pushToast("Plank completed!");
  };


  return (
    <div 
      style={{
        maxWidth: 600,
        width: "100%",
        margin: "0 ",
        minHeight: 400,
        background:
          "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.95))",
        borderRadius: 20,
        padding: "1rem 1.3rem",
        color: "#fff",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <motion.div
        style={{
          width: "100%",
          maxWidth: 530,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 800,
              color: "#4178f0ff",
              fontSize: 22,
            }}
          >
            <GiTreasureMap /> Daily Quests
          </div>
        </div>

        {/* Quest List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {quests.map((q, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: 12,
                height: 60,
                border: q.completed
                  ? "1px solid rgba(34,197,94,0.7)"
                  : q.failed
                  ? "1px solid rgba(239,68,68,0.7)"
                  : "1px solid rgba(148,163,184,0.06)",
                background: q.completed
                  ? "linear-gradient(90deg,#052e21,#083d2a)"
                  : q.failed
                  ? "linear-gradient(90deg,#3b0a0a,#2b0a0a)"
                  : "rgba(255,255,255,0.02)",
                color: q.completed
                  ? "#dcfce7"
                  : q.failed
                  ? "#ffd7d7"
                  : "#e6eefb",
              }}
            >
              <div>
                <div style={{ fontSize: "1.3rem", fontWeight: 500 }}>
                  {q.name}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                  {q.name === "Plank" ? `${q.duration}s` : `${q.duration} reps`}
                </div>
              </div>
              <div>
                {q.completed ? (
                  <button
                    disabled
                    style={{
                      background: "rgba(148,163,184,0.12)",
                      color: "#93a3b8",
                      padding: "6px 8px",
                      borderRadius: 10,
                      border: "none",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "not-allowed",
                    }}
                  >
                    <FaCheck /> Done
                  </button>
                ) : (
                  <button
                    onClick={() => startQuest(i)}
                    disabled={!!activeQuest}
                    style={{
                      // background: !!activeQuest
                      //   ? "rgba(148,163,184,0.12)"
                      //   : "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
                      color: !!activeQuest ? "#93a3b8" : "#ffffffff",
                      padding: "0.4rem 1rem",
                      border: "1px solid #0bdcf8ff ",
                      borderRadius: 10,
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      cursor: !!activeQuest ? "not-allowed" : "pointer",
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
                    {q.name === "Plank" && q.started
                      ? "In Progress"
                      : q.failed
                      ? "Retry"
                      : "Start"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Open Chest Button */}
        <button
          onClick={openChest}
          style={{
            width: "100%",
            padding: "0.5rem 1rem",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "1.5rem",
            background: chestOpened
              ? "#374151"
              : "linear-gradient(90deg, #93a8e2ff, #06b6d4)",
            color: chestOpened ? "#9ca3af" : "#001f14",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <GiChest size={26} /> {chestOpened ? "Chest Opened!" : "Open Chest"}
        </button>
      </motion.div>

      {/* Plank Timer Modal */}
      {activeQuest !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(2,6,23,0.7)",
            zIndex: 99,
            padding: 16,
          }}
        >
          <motion.div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#071022",
              borderRadius: 14,
              padding: 18,
              textAlign: "center",
              border: "1px solid rgba(245,158,11,0.12)",
              boxShadow: "0 12px 38px rgba(2,6,23,0.6)",
              color: "#e6eefb",
              position: "relative",
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              onClick={cancelPlank}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>
            <FaClock size={44} style={{ color: "#fbbf24", marginBottom: 8 }} />
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              Plank Challenge
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#e6eefb",
                marginBottom: 4,
              }}
            >
              {timer ?? "—"}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
              seconds
            </div>
            <div
              style={{
                width: "100%",
                height: 10,
                background: "#091226",
                borderRadius: 999,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#10b981",
                  width: `${
                    timer !== null && quests[activeQuest]
                      ? Math.max(
                          0,
                          ((quests[activeQuest].duration - timer) /
                            quests[activeQuest].duration) *
                            100,
                        )
                      : 0
                  }%`,
                  transition: "width 0.2s linear",
                }}
              />
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
              {isPlankReady
                ? "Plank time complete — tap Finish to claim rewards."
                : "Hold steady until the timer ends."}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {!isPlankReady ? (
                <button
                  onClick={cancelPlank}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    background: "#ef4444",
                    border: "none",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={finishPlank}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    background: "#10b981",
                    border: "none",
                    color: "#062e25",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Finish
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Popup Modal */}
      {popup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(2,6,23,0.7)",
            zIndex: 99,
            padding: 16,
            fontSize: "1.2rem",
            gap: "1rem",
          }}
        >
          <motion.div
            style={{
              gap: "2rem",
              background: "#00002e7b",
              backdropFilter: "blur(2px)",
              padding: "1rem",
              border: "1px solid #0bdcf8ff",
              borderRadius: "1rem",
              maxWidth: "350px",
              width: "90%",
              height: "16rem",
              textAlign: "center",
              color: "#fff",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {popup === "reward" ? (
              <>
                <GiChest
                  size={36}
                  style={{ color: "#fbbf24", marginBottom: 8 }}
                />
                <div style={{ fontWeight: 900, marginBottom: 6 }}>
                  Chest Opened!
                </div>
                <div
                  style={{ color: "#fbbf24", fontWeight: 800, marginBottom: 8 }}
                >
                  Rewards Gained 🎁
                </div>
                <div style={{ marginBottom: 4 }}>
                  +{quests.reduce((s, q) => s + q.exp, 0)} EXP
                </div>
                <div>+1 Random Stat</div>
              </>
            ) : (
              <>
                <FaExclamationTriangle
                  size={36}
                  style={{ color: "#ef4444", marginBottom: 8 }}
                />
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Warning</div>
                <div style={{ color: "#94a3b8" }}>
                  {chestOpened
                    ? "Reward already claimed!"
                    : "Complete all quests first!"}
                </div>
              </>
            )}
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setPopup(null)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "#f59e0b",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {/* {toast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "fixed",
            top: 17,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#05202a",
            color: "#dbeafe",
            padding: "8px 14px",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(2,6,23,0.6)",
            zIndex: 120,
          }}
        >
          {toast}
        </motion.div>
      )} */}
    </div>
  );
};

export default DailyQuest;