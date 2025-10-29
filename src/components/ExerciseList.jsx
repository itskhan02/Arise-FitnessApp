import React, { useEffect, useState } from "react";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          "https://wmddgktx-8000.inc1.devtunnels.ms/api/url/"
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

  return (
    <div className=" bg-neutral flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-semibold text-neutral-800 mb-8 text-center">
        Exercise List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
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
        }}>
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold text-neutral-800 mb-2 truncate">
                {exercise.title}
              </h2>

              <div className="space-y-1 text-sm text-neutral-600">
                {/* <p>
                  <span className="font-medium text-neutral-700">Type:</span>{" "}
                  {exercise.exercise_type}
                </p>
                <p>
                  <span className="font-medium text-neutral-700">Body Part:</span>{" "}
                  {exercise.bodypart}
                </p>
                <p>
                  <span className="font-medium text-neutral-700">Equipment:</span>{" "}
                  {exercise.equipment}
                </p>
                <p>
                  <span className="font-medium text-neutral-700">Level:</span>{" "}
                  {exercise.level}
                </p> */}
                <p>
                  <span className="font-medium text-neutral-700">
                  
                  <iframe src={exercise.url} title={exercise.title} width="100%" height="200" frameBorder="0" allowFullScreen>demo
                  </iframe>
                  </span>{" "}
                  
                </p>
              </div>
            </div>
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
