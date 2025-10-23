import React, { useEffect, useState } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Home, Music, User2 } from "lucide-react";
import { BsBarChart } from "react-icons/bs";
import { CgGym } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import DailyStreakTracker from "./DailyStreakTracker";
import WorkoutDay from "./WorkoutDay";
import Calories from "./Calories";
import WaterIntake from "./Waterintake";
import Motivation from "./Motivation";
import Quest from "./Quest";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: CgGym, label: "Exercises", path: "/exercises" },
  { icon: BsBarChart, label: "Progress", path: "/progress" },
  { icon: User2, label: "Profile", path: "/profile" },
];

const LOCAL_KEY = "streak-checked-days";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [checkedDays, setCheckedDays] = useState([]);

  // Load checked days from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.completed)) {
          setCheckedDays(parsed.completed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse streak checked days from localStorage", e);
    }
  }, []);

  // Update checked days in state and localStorage
  const handleCheckedDaysChange = (newCheckedDays) => {
    setCheckedDays(newCheckedDays);
    try {
      const payload = { completed: newCheckedDays, skipped: [], savedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to save streak checked days to localStorage", e);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "2rem",
        background:
          "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
        color: "#fff",
        fontSize: "1.5rem",
        position: "relative",
        padding: "5rem 1rem 7rem 1rem",
      }}
    >
      {/* ------- SIGNED IN ------- */}
      <SignedIn>
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 2,
          }}
        >
          <UserButton />
        </div>

      {/* Dashboard */}
      <div className="main-content-card"
        style={{
          width: "100%",
        }}
        >
        <div  className="sub-content" style={{ width: "100%" }}>
          <DailyStreakTracker
            userName={user?.firstName}
            storageKey={LOCAL_KEY}
            initialCheckedDays={checkedDays}
            onCheckedDaysChange={handleCheckedDaysChange}
          />

          

          <div className="cal"
            style={{
              width: "100%",
              maxWidth: "500px",

            }}
          >
            <WaterIntake />
            <Calories />
          </div>
        </div>

        <div className="sub-content" style={{ width: "100%" }}>
          <div 
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
        <Motivation />
        <WorkoutDay />
          </div>
          <Quest />
        </div>
        
      </div>

        {/* NAVIGATION */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            background: "rgba(0, 67, 200, 0.89)",
            backdropFilter: "blur(10px)",
            borderRadius: "9999px",
            padding: "0.6rem 1rem",
            width: "18rem",
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: isActive ? "3rem" : "50%",
                  height: "3rem",
                  width: "3rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: isActive
                    ? "radial-gradient(circle, #0034deff 0%, #00c3ff 90%)"
                    : "transparent",
                  boxShadow: isActive
                    ? "0 0 15px rgba(11, 220, 248, 0.6)"
                    : "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.transform = "scale(1.2)";
                    e.target.style.boxShadow =
                      "0 0 15px rgba(11, 220, 248, 0.6)";
                    e.target.style.transition = "all 0.3s ease";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                <Icon
                  size={28}
                  color={isActive ? "#fff" : "#fff8f8ff"}
                  style={{ transition: "color 0.3s ease" }}
                />
              </div>
            );
          })}
        </div>
      </SignedIn>

      {/* --------- SIGNED OUT --------- */}
      <SignedOut>
        <div
          style={{
            textAlign: "center",
            color: "#ccc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <p>Please sign in to access your dashboard.</p>
          <SignInButton mode="modal">
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                height: "2.8rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #0bdcf8ff",
                background: "#02013b",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import {
//   useUser,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import { Home, User2 } from "lucide-react";
// import { BsBarChart } from "react-icons/bs";
// import { CgGym } from "react-icons/cg";
// import { useLocation, useNavigate } from "react-router-dom";
// import DailyStreakTracker from "./DailyStreakTracker"; 
// import WorkoutDay from "./WorkoutDay";
// import Quest from "./Quest";
// import Calories from "./Calories";
// import WaterIntake from "./Waterintake";



// const navItems = [
//   { icon: Home, label: "Home", path: "/home" },
//   { icon: CgGym, label: "Exercises", path: "/exercises" },
//   { icon: BsBarChart, label: "Progress", path: "/progress" },
//   { icon: User2, label: "Profile", path: "/profile" },
// ];

// const LOCAL_KEY = "streak-checked-days";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useUser();

//   const [checkedDays, setCheckedDays] = useState([]);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LOCAL_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         if (parsed && Array.isArray(parsed.completed)) {
//           setCheckedDays(parsed.completed);
//         }
//       }
//     } catch (e) {
//       console.warn("Failed to parse streak checked days from localStorage", e);
//     }
//   }, []);

//   const handleCheckedDaysChange = (newCheckedDays) => {
//     setCheckedDays(newCheckedDays);
//     try {
//       const payload = { completed: newCheckedDays, skipped: [], savedAt: new Date().toISOString() };
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
//     } catch (e) {
//       console.warn("Failed to save streak checked days to localStorage", e);
//     }
//   };

//   return (
//     <div
//       className="dashboard-layout"
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
//         color: "#fff",
//         fontSize: "1.5rem",
//         position: "relative",
//       }}
//     >
//    {/* ------- SIGNED IN ------- */}
//       <SignedIn>
//         <div
//           style={{
//             position: "absolute",
//             top: "1rem",
//             left: "1rem",
//             zIndex: 2,
//           }}
//         >
//           <UserButton />
//         </div>

//       {/* Dashboard */}
//       <div className="main-content-card"
//         style={{
//           width: "100%",
//         }}
//         >
//         <div  className="sub-content" style={{ width: "100%" }}>
//           <DailyStreakTracker
//             userName={user?.firstName}
//             storageKey={LOCAL_KEY}
//             initialCheckedDays={checkedDays}
//             onCheckedDaysChange={handleCheckedDaysChange}
//           />

//           <div className="cal"
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               padding: "0 2rem",
//             }}
//           >
//             <WaterIntake />
//             <Calories />
//           </div>
//         </div>

//         <div className="sub-content" style={{ width: "100%" }}>
//                 <Quest />
//             <div 
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               padding: "0 2rem",
//             }}
//           >
//         <Motivation />
//           </div>  
//         </div>

//                 <div className="sub-content" style={{ width: "100%" }}>
//                 <WorkoutDay />
//             <div 
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               padding: "0 2rem",
//             }}
//           >
//         <MusicPlayer />
//           </div>
        
//         </div>
        
//       </div>


//         {/* NAVIGATION (Fixed Mobile Bar - doesn't need to be responsive) */}
//         <div
//           style={{
//             position: "fixed",
//             bottom: "2rem",
//             display: "flex",
//             justifyContent: "space-around",
//             alignItems: "center",
//             background: "rgba(0, 67, 200, 0.89)",
//             backdropFilter: "blur(10px)",
//             borderRadius: "9999px",
//             padding: "0.6rem 1rem",
//             width: "18rem",
//           }}
//         >
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <div
//                 key={item.label}
//                 onClick={() => navigate(item.path)}
//                 style={{
//                   cursor: "pointer",
//                   padding: "0.5rem",
//                   borderRadius: isActive ? "3rem" : "50%",
//                   height: "3rem",
//                   width: "3rem",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "0.5rem",
//                   background: isActive
//                     ? "radial-gradient(circle, #0034deff 0%, #00c3ff 90%)"
//                     : "transparent",
//                   boxShadow: isActive
//                     ? "0 0 15px rgba(11, 220, 248, 0.6)"
//                     : "none",
//                   transition: "all 0.3s ease",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isActive) {
//                     e.currentTarget.style.transform = "scale(1.2)";
//                     e.currentTarget.style.boxShadow = "0 0 15px rgba(11, 220, 248, 0.6)";
//                     e.currentTarget.style.transition = "all 0.3s ease";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isActive) {
//                     e.currentTarget.style.transform = "scale(1)";
//                     e.currentTarget.style.boxShadow = "none";
//                   }
//                 }}
//               >
//                 <Icon
//                   size={28}
//                   color={isActive ? "#fff" : "#fff8f8ff"}
//                   style={{ transition: "color 0.3s ease" }}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </SignedIn>

//       {/* --------- SIGNED OUT --------- */}
//       <SignedOut>
//         <div
//           style={{
//             textAlign: "center",
//             color: "#ccc",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "1.5rem",
//           }}
//         >
//           <p>Please sign in to access your dashboard.</p>
//           <SignInButton mode="modal">
//             <button
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 height: "2.8rem",
//                 padding: "0.75rem 1.5rem",
//                 borderRadius: "0.5rem",
//                 border: "1px solid #0bdcf8ff",
//                 background: "#02013b",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontSize: "1rem",
//               }}
//             >
//               Sign In
//             </button>
//           </SignInButton>
//         </div>
//       </SignedOut>
//     </div>
//   );
// };

// export default Dashboard;