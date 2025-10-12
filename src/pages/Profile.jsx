import React, { useEffect, useState } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
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

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [details, setDetails] = useState({
    fullName: "",
    age: "",
    height: "",
    weight: "",
    level: "Beginner",
    customImage: "",
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const savedDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {
      fullName: user?.fullName || "",
      age: "25",
      height: "170 cm",
      weight: "65 kg",
      level: "Beginner",
      customImage: "",
    };
    setDetails(savedDetails);
    setTempName(savedDetails.fullName);
  }, [user]);

  const handleFieldChange = (field, value) => {
    const updated = { ...details, [field]: value };
    setDetails(updated);
    sessionStorage.setItem("userDetails", JSON.stringify(updated));
  };

  const handleNameSave = async () => {
    try {
      if (user && tempName.trim()) {
        await user.update({ fullName: tempName.trim() });
        handleFieldChange("fullName", tempName.trim());
        setIsEditingName(false);
      }
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleFieldChange("customImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const profileImage = details.customImage || user?.imageUrl;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background:
          "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
        color: "#fff",
        fontSize: "1.2rem",
        position: "relative",
        overflowY: "auto",
        paddingBottom: "6rem",
      }}
    >
      <SignedIn>
        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
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

          {/* Editable Full Name with Edit/Save button */}
          <div
            style={{
              display: "flex",
              flexDirection: isEditingName ? "column" : "row",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  style={{
                    fontWeight: "600",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                    padding: "0.3rem 0.5rem",
                    color: "#fff",
                    outline: "none",
                    width: "80%",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={handleNameSave}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "0.3rem",
                      border: "none",
                      background: "#00c3ff",
                      color: "#000",
                      cursor: "pointer",
                      fontWeight: "500",
                      height: "1.7rem",
                      width: "3.5rem",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setTempName(details.fullName);
                    }}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "0.3rem",
                      border: "none",
                      background: "#ff4d4d",
                      color: "#000",
                      cursor: "pointer",
                      fontWeight: "500",
                      height: "1.7rem",
                      width: "5rem",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontWeight: "600", fontSize: "1.5rem", margin: 1 }}>
                  {details.fullName || "User"}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  style={{
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.3rem",
                    border: "none",
                    height: "1.7rem",
                    width: "3rem",
                    background: "#00c3ff",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "1rem",
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </div>
          {/* <p style={{ color: "#818080ff", fontSize: "0.9rem" }}>
            {user?.primaryEmailAddress?.emailAddress}
          </p> */}
        </div>

        {/* PERSONAL DETAILS CARD */}
        <div
          style={{
            marginTop: "2rem",
            width: "85%",
            maxWidth: "400px",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "1rem",
            padding: "1.5rem",
            boxShadow: "0 0 15px rgba(11, 220, 248, 0.3)",
          }}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: "600",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Personal Details
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            {["age", "height", "weight", "level"].map((field) => (
              <div key={field}>
                <label
                  style={{
                    fontSize: "0.9rem",
                    color: "#ccc",
                    textTransform: "capitalize",
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  {field}
                </label>
                <input
                  type="text"
                  value={details[field]}
                  onChange={(e) =>
                    handleFieldChange(field, e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    outline: "none",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            ))}
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
                  width: isActive ? "auto" : "3rem",
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
                border: "1px solid #0bdcf8ff ",
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
