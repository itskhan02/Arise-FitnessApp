import React, { useEffect, useState } from "react";
import { BiSearch } from 'react-icons/bi';
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import {useAuth} from '@clerk/clerk-react';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const {getToken} = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          "https://testing-backend-4cpr.onrender.com/api/exercise/",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data)
        setExercises(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    getData();
  }, []);

  const toggleExpand = (exerciseId) => {
    if (expandedId === exerciseId) {
      setExpandedId(null);
    } else {
      setExpandedId(exerciseId);
    }
  };

  return (
    <div className=" bg-neutral flex flex-col items-center py-10 px-4">
      <h1
        className="ex-head"
        style={{
          fontSize: "1.6rem",
          fontWeight: "500",
          marginTop: "0.8rem",
          marginBottom: "1rem",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        Exercise List
      </h1>

      <div
        className="exercise-list "
        tabIndex={0}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "1.5rem",
          maxHeight: "75vh",
          marginBottom: "4rem",
          overflowY: "auto",
          top: "11rem",

        }}
      >
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            
            style={{
              maxWidth: 500,
              margin: "0",
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
              borderRadius: 20,
              padding: "1rem",
              color: "#fff",
              boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              lineHeight: "2",
            }}
          >
            <div className="exercise-card"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",

            }}
            > 
            <div 
            style={{  display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", }}
            >
              <h2 className="text-lg font-semibold">{exercise.title}</h2>
              <p className="text-sm text-neutral-400 mt-1">Reps: {exercise.reps_sets}</p>
              
            </div>
              <button
                onClick={() => toggleExpand(exercise.id)}
                className="text-white text-xl focus:outline-none"
                style={{
            background:
              "linear-gradient(90deg, rgba(99,102,241,1), rgba(168,85,247,1))",
            color: "#fff",
            border: "none",
            padding: "0.2rem 0.6rem",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: "0.3rem",
            transition: "all 0.3s ease",
          }}
              >
              Start
                {expandedId === exercise.id ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button>
            </div>

            {expandedId === exercise.id && (
              <div className="mt-4 flex justify-center">
                <iframe
                  width="100%"
                  height="250"
                  src={exercise.url}
                  title={exercise.title}
                  
                  allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture; "
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>
            )}
          </div>
        ))}
        {exercises.length === 0 && (
          <div className="text-neutral-600 col-span-full text-center py-10">
            Loading exercises...
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
