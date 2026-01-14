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
import FitBot from "./FitBot";

import { loginUser, getUserData } from "../api/userApi";

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
  const { user, isSignedIn } = useUser(); 

  const [checkedDays, setCheckedDays] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [userWeight, setUserWeight] = useState(70);
  const [serverUserData, setServerUserData] = useState(null); 
  const COMPLETED_EXERCISES_KEY = "completedExercises";

  useEffect(() => {
    if (isSignedIn && user?.id) {
      const syncWithBackend = async () => {
        try {
          await loginUser(user.id);

          const data = await getUserData(user.id);
          setServerUserData(data);
        } catch (err) {
          console.error("Error syncing user with backend:", err);
        }
      };
      syncWithBackend();
    }
  }, [isSignedIn, user]);

  useEffect(() => {
  if (user) loginUser(user.id);
}, [user]);



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

    setUserWeight(parseFloat(sessionStorage.getItem("userWeight")) || 70);

    const savedExercisesRaw = sessionStorage.getItem(COMPLETED_EXERCISES_KEY);
    if (savedExercisesRaw) {
      const savedExercises = JSON.parse(savedExercisesRaw);
      const todayStr = new Date().toDateString();
      const todayExercises = savedExercises.filter(
        (ex) => new Date(ex.timestamp).toDateString() === todayStr
      );
      setCompletedExercises(todayExercises);
    }

    const handleCaloriesUpdate = (event) => {
      const newExercise = {
        ...event.detail,
        timestamp: new Date().toISOString(),
      };
      setCompletedExercises((prev) => [...prev, newExercise]);
    };

    window.addEventListener("caloriesUpdated", handleCaloriesUpdate);
    return () => {
      window.removeEventListener("caloriesUpdated", handleCaloriesUpdate);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      COMPLETED_EXERCISES_KEY,
      JSON.stringify(completedExercises)
    );
  }, [completedExercises]);

  const handleCheckedDaysChange = (newCheckedDays) => {
    setCheckedDays(newCheckedDays);
    try {
      const payload = {
        completed: newCheckedDays,
        skipped: [],
        savedAt: new Date().toISOString(),
      };
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

        <FitBot userImage={user?.imageUrl} />
        <div
          className="main-content-card"
          style={{
            width: "100%",
          }}
        >
          <div className="sub-content" style={{ width: "100%" }}>
            <DailyStreakTracker
              userName={user?.firstName}
              storageKey={LOCAL_KEY}
              initialCheckedDays={checkedDays}
              onCheckedDaysChange={handleCheckedDaysChange}
            />

            <div
              className="cal"
              style={{
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <WaterIntake />
              <Calories
                exercises={completedExercises}
                userWeight={userWeight}
              />
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
            <Quest/>
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

