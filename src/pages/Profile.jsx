import React, { useEffect, useState } from "react";
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
import UserLevel from "../components/UserLevel";
import UserData from "../components/UserData";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: CgGym, label: "Exercises", path: "/exercises" },
  { icon: BsBarChart, label: "Progress", path: "/progress" },
  { icon: User2, label: "Profile", path: "/profile" },
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();

  const [details, setDetails] = useState({
    fullName: "",
    dob: "2000-01-01",
    age: 0,
    height: 170,
    weight: 65,
    level: "Beginner",
    customImage: "",
    gender: "",
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // load initial details (and also allow session storage values)
  useEffect(() => {
    if (isLoaded && user) {
      const savedDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
      const dob =
        savedDetails.dob || sessionStorage.getItem("userDOB") || "2000-01-01";

      const initialDetails = {
        fullName: user.fullName || savedDetails.fullName || user.firstName || "",
        dob,
        age: calculateAge(dob),
        height:
          Math.round(parseFloat(sessionStorage.getItem("originalHeight"))) ||
          170,
        weight: parseFloat(sessionStorage.getItem("userWeight")) || 65,
        level: JSON.parse(sessionStorage.getItem("userLevel")) || "Beginner",
        customImage: savedDetails.customImage || "",
        gender: sessionStorage.getItem("userGender") || "",
      };

      setDetails(initialDetails);
      // persist what we loaded
      sessionStorage.setItem("userDetails", JSON.stringify(initialDetails));
    }
  }, [user, isLoaded]);

  // keep local details in sync when Clerk user changes elsewhere (two-way sync)
  useEffect(() => {
    if (isLoaded && user) {
      const clerkFullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (clerkFullName && clerkFullName !== details.fullName) {
        const updated = { ...details, fullName: clerkFullName };
        setDetails(updated);
        sessionStorage.setItem("userDetails", JSON.stringify(updated));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.fullName, user?.firstName, user?.lastName, isLoaded]);

  const handleFieldChange = (field, value) => {
    const updated = { ...details, [field]: value };
    if (field === "dob") updated.age = calculateAge(value);
    setDetails(updated);
    sessionStorage.setItem("userDetails", JSON.stringify(updated));
    if (field === "dob") {
      sessionStorage.setItem("userDOB", value);
    }
  };

  // Image upload: keep original style/behavior but use Clerk's file object update where possible
  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async () => {
      // store base64 for immediate preview and persistence
      handleFieldChange("customImage", reader.result);
      try {

        await user.update({ imageUrl: reader.result });
      } catch (err) {
        console.error("Failed to update Clerk image:", err);
      }
    };

    reader.readAsDataURL(file);
  };

  const profileImage = details.customImage || user?.imageUrl;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background:
          "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
        color: "#fff",
        fontSize: "1.2rem",
        padding: "2rem",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <SignedIn>
        <div
          className="user-profile"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Profile Image */}
          <div style={{ position: "relative" }}>
            <img
              src={profileImage}
              alt="User Avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "3px solid #00c3ff",
                boxShadow: "0 0 15px rgba(11, 220, 248, 0.5)",
                objectFit: "cover",
              }}
            />
            <label
              htmlFor="uploadImage"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "0",
                background: "#00c3ff",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#000",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              +
            </label>
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Editable Full Name */}
          <div
          >
            <h2 style={{ fontWeight: "600", fontSize: "1.5rem", margin: 1 }}>
              {details.fullName || "User"}
            </h2>
          </div>

          {details.gender && (
            <p
              style={{
                textTransform: "capitalize",
                color: "#ccc",
                fontSize: "1rem",
                margin: 0,
              }}
            >
              {details.gender}
            </p>
          )}
        </div>

        {/* User Progress */}
        <UserLevel />

        {/* Personal Details */}
        <UserData />

        {/* Bottom Nav */}
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
                  width: "2.5rem",
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
                <Icon size={28} color="#fff" />
              </div>
            );
          })}
        </div>
      </SignedIn>

      <SignedOut>
        <div
          style={{
            marginTop: "6rem",
            textAlign: "center",
            color: "#ccc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p>Please sign in to view your profile.</p>
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

export default Profile;
