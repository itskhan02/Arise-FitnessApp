import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { MoveLeft } from "lucide-react";

const ExerciseVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const exercise = location.state?.exercise;

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <p>No exercise data found.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            background:
              "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1rem",
            borderRadius: "10px",
            fontSize: "1rem",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const embedUrl = exercise.url?.includes("youtu.be")
    ? exercise.url.replace("youtu.be/", "www.youtube.com/embed/")
    : exercise.url?.replace("watch?v=", "embed/");

  return (
    <div
      className="flex flex-col items-center justify-center py-10 px-4"
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
        padding: "5rem 1rem 7rem 1rem",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          color: "#acaab4ff",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <MoveLeft size={34} />
      </button>

      <div
        className="exercise-video"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
          {exercise.title}
        </h1>

        <iframe
          src={embedUrl}
          title={exercise.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            width: "90%",
            height: "100%",
            borderRadius: "15px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        ></iframe>

        {/* <ReactPlayer
        url={embedUrl}
        controls={true}
        width="560px"
        height="315px    "
        style={{
          borderRadius: "15px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      /> */}
      </div>
    </div>
  );
};

export default ExerciseVideo;
