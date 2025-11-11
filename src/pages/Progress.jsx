import React, { useState, useEffect } from 'react'
import { SignedIn, useUser, SignedOut, SignInButton} from "@clerk/clerk-react";
import { Home,  User2, } from "lucide-react";
import { BsBarChart} from 'react-icons/bs';
import { CgGym } from 'react-icons/cg';
import { useLocation, useNavigate } from "react-router-dom";
import ProgressChart from '../components/ProgressChart';
import StatChart from "../components/StatChart";
import Stats from '../components/Stats';


const USER_PROGRESS_KEY = "user_progress_history";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: CgGym, label: "Exercises", path: "/exercises" },
  { icon: BsBarChart, label: "Progress", path: "/progress" },
  { icon: User2, label: "Profile", path: "/profile" },
];


const Progress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [userStats, setUserStats] = useState({
    strength: 0,
    stamina: 0,
    agility: 0,
    endurance: 0,
    mobility: 0,
  });

  useEffect(() => {
    const loadLatestStats = () => {
      const progressHistoryRaw = localStorage.getItem(USER_PROGRESS_KEY);
      let latestStats = { strength: 0, stamina: 0, agility: 0, endurance: 0, mobility: 0 };
      if (progressHistoryRaw) {
        try {
          const progressHistory = JSON.parse(progressHistoryRaw);
          const allDates = Object.keys(progressHistory).sort();
          if (allDates.length > 0) {
            const latestDate = allDates[allDates.length - 1];
            if (progressHistory[latestDate] && progressHistory[latestDate].stats) {
              latestStats = progressHistory[latestDate].stats;
            }
          }
        } catch (e) {
          console.error("Failed to parse user progress history from localStorage", e);
        }
      }
      setUserStats(latestStats);
    };

    loadLatestStats();

    window.addEventListener("userExpUpdated", loadLatestStats);

    return () => {
      window.removeEventListener("userExpUpdated", loadLatestStats);
    };
  }, [user]);


  return (
    <>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        gap: "2rem",
        background:
          "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
        color: "#fff",
        fontSize: "1.5rem",
        position: "relative",
        padding: "3rem 1rem 7rem 1rem",
      }}
    >
       {/* ------- SIGNED IN ------- */}
      <SignedIn>

        {/* Progress  */}
        <div className="progress-content-card"
        style={{

        }}
        >
          <h1 style={{ fontWeight: "600", fontSize: "1.6rem", color: "#fff", marginBottom: "1rem"}}>
            User Stats and Progress
          </h1>
        <div  className="progress-sub-content" style={{ width: "100%" }}>
            
            <ProgressChart/>
            <StatChart stats={userStats} />

            <Stats stats={userStats} />




          <div className="cal"
            style={{
              width: "100%",
              maxWidth: "1200px",
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >

          </div>
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
            height: "3.5rem",
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
                  height: "2.5rem",
                  width: isActive ? "2.5rem" : "2.5rem",
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
                    e.target.style.boxShadow = "0 0 15px rgba(11, 220, 248, 0.6)";
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
          <p>Please sign in to access your progress.</p>
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
    </>
  )
}

export default Progress
