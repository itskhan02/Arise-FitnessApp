import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    "Analyzing your profile to create your personalized fitness plan..."
  );
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const nextProgress = prev + 1;
          if (nextProgress <= 20) {
            setStatusText("Analyzing your fitness profile...");
          } else if (nextProgress <= 40) {
            setStatusText("Reviewing your goals and preferences...");
          } else if (nextProgress <= 60) {
            setStatusText("Creating your personalized workout plan...");
          } else if (nextProgress <= 80) {
            setStatusText("Finalizing your fitness program...");
          } else if (nextProgress <= 99) {
            setStatusText("Almost ready...");
          }

          return nextProgress;
        } else {
          clearInterval(interval);
          setShowPopup(true);
          return 100;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className="setup-page"
        style={{
          height: "99vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
          margin: "4px",
          background:
            "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
          boxShadow: "0 0 40px 20px #3a1c71, 0 0 80px 20px #0e2483ff",
          borderRadius: ".5rem",
          overflow: "hidden",
        }}
      >
      <div
        className="qoute"
        style={{
          textAlign: "center", 
          alignItems: "center", 
          color: "#fff",
          // position: "relative",
          // top: "-5rem",
          }}
      ><p>Analyzing your data to create your personalized fitness plan...</p>
      </div>
        <div
          className="loader"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            color: "#fff",
            fontSize: "1.2rem",
            width: "80%",
          }}
        >
          {/* Progress Bar */}
          <div
            style={{
              width: "60%",
              height: "2rem",
              background: "#3a3a3a",
              borderRadius: "5px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #8adca6ff, #0bdcf8ff)",
                transition: "width 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.8rem",
                position: "relative",
              }}
            >
              {progress}%
            </div>
          </div>
                      <p style={{ textAlign: "center", marginBottom: "2rem", marginTop: "2rem" }}>
            {statusText}
          </p>

        </div>
      </div>
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#00002e7b",
            color: "#fff",
            border: "1px solid #0bdcf8ff",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            textAlign: "center",
            fontSize: "1.2rem",
            width: "28rem",
            height: "18rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            backdropFilter: "blur(3px)",
          }}
        >
          <h2>Setup Complete!</h2>
          <p>Your personalized fitness plan is ready.</p>
          <p>Please log in to continue.</p>
          <button
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              border: "1px solid #0bdcf8ff ",
              borderRadius: "3px",
              width: "6rem",
              background: "#02013b",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      )}
    </>
  );
};

export default Setup;
