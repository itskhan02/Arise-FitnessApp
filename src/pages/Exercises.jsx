import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";
import { Home, User2 } from "lucide-react";
import { BsBarChart } from "react-icons/bs";
import { CgGym } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: CgGym, label: "Exercises", path: "/exercises" },
  { icon: BsBarChart, label: "Progress", path: "/progress" },
  { icon: User2, label: "Profile", path: "/profile" },
];

const Exercises = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  return (
    <div
      style={{
        height: "100vh",
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
      }}
    >
      {/* ------- SIGNED IN ------- */}
      <SignedIn>

        {/* Exercises Content */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontWeight: "600", fontSize: "2rem" }}>
            Welcome, {user?.firstName || "User"} 👋
          </h1>
          <p style={{ color: "#aaa", fontSize: "1rem", marginTop: "0.5rem" }}>
            Exercise page coming soon.
          </p>
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
                  width: isActive ? "3rem" : "3rem",
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
          <p>Please sign in to access the exercises.</p>
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

export default Exercises;
