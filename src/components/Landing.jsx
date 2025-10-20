import { CircleAlert } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiUserCircle } from 'react-icons/bi';
import IMG from '/public/dagger.png';

const Landing = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleAccept = () => {
    setShowDialog(false);
    navigate("/gender");
  };

    const handleSkip = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        className="landing-page"
        style={{
          height: "99vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
          margin: "4px",
          // background:
          //   "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
          // boxShadow: "0 0 40px 20px #3a1c71, 0 0 80px 20px #0e2483ff ",
          background: "linear-gradient(180deg, #00002e, #0a0a5a)",
          boxShadow: "0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
          borderRadius: ".5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "0.8rem",
            right: "1rem",
            padding: "0.5rem 0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #0bdcf8ff",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            zIndex: 2,
            width: "100px",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
          onClick={handleSkip}
        >
        <BiUserCircle size={30} style={{ marginRight: "0.5rem" }} />
        Login
        </button>
        <div
          className="qoute "
          style={{ textAlign: "center", alignItems: "center", color: "#fff", margin: "1rem 0", padding: "0 1rem", fontFamily: "'Nunito', serif", lineHeight: "5rem" }}
        >
          <h2>Welcome to Arise System</h2>
          <h3>Your Training Arc Starts Here</h3>
          <p>
            Push past your limits. Grow stronger every day. Begin your journey now.
          </p>
          <p>
            Join us to achieve your health and wellness goals with personalized
            plans and expert guidance.
          </p>
        </div>
        <button
          className="cssbuttons-io-button"
          onClick={() => setShowDialog(true)}
        >
          <div className="icon">
            <img src={IMG} alt="" style={{ height: "2rem", width: "7rem" }} />
          </div>
          Get started
        </button>
      </div>
      {showDialog && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
          className="dialog-box"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              background: "#00002e7b",
              backdropFilter: "blur(2px)",
              padding: "4rem",
              border: "1px solid #0bdcf8ff",
              borderRadius: "1rem",
              maxWidth: "400px",
              height: "17rem",
              textAlign: "center",
              color: "#fff",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                fontSize: "1.2rem",
              }}
            >
              <CircleAlert size={20} /> Notification
            </h3>
            <div style={{ fontSize: "1rem", textAlign: "center" }}>
              <p>
                You have acquired the qualification to become a{" "}
                <span style={{ color: "#0bdcf8ff" }}>
                  <i>Player.</i>
                </span>
              </p>
              <p>Will You accept?</p>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <button
                onClick={handleAccept}
                style={{
                  padding: "0.5rem 1rem",
                  justifyContent: "center",
                  border: "1px solid #0bdcf8ff ",
                  // borderRadius: "8px",
                  background: "#02013b",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Landing;
