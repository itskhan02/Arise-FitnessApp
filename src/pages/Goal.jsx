import React, { useState, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight } from "lucide-react";

const Goal = () => {
  const categories = [
    { name: 'Gain Weight', key: 'G' },
    { name: 'Lose Weight', key: 'L' },
    { name: 'Stay Fit', key: 'F' },
  ];

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go to previous page
  };

// const handleNext = () => {
//   if (selectedCategory) {
//     localStorage.setItem("userGoal", JSON.stringify(selectedCategory));
//     navigate('/focus');
//   }
// };

const handleNext = () => {
  if (selectedCategory) {
    sessionStorage.setItem("userGoal", JSON.stringify(selectedCategory));
    navigate('/focus');
  }
};

  const [selectedCategory, setSelectedCategory] = useState(null);

//   useEffect(() => {
//   const savedGoal = localStorage.getItem("userGoal");
//   if (savedGoal) {
//     setSelectedCategory(JSON.parse(savedGoal));
//   }
// }, []);

useEffect(() => {
  const savedGoal = sessionStorage.getItem("userGoal");
  if (savedGoal) {
    setSelectedCategory(JSON.parse(savedGoal));
  }
}, []);

  return (
    <>
      <div className="goal-page"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "8rem",
          paddingTop: "1rem",
          // background: "linear-gradient(135deg, #101325ff 0%, #14257aff 60%, #3d1090ff 100%)",
          background:"#00002e",
          boxShadow:"0 0 20px 10px #3a1c71, 0 0 30px 10px #0e2483ff inset",
          position: "relative",
          overflow: "hidden",
        }}>
        <button
          style={{
            position: "absolute",
            top: "0.8rem",
            left: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            color: "#acaab4ff",
            cursor: "pointer",
            zIndex: 2,
            background: "transparent",
            transition: "transform 0.15s",
          }}
          onClick={handleBack}
          onMouseOver={e => e.currentTarget.style.transform = "translateX(-3px)"}
          onMouseOut={e => e.currentTarget.style.transform = "none"}
        >
          <MoveLeft size={34} />
        </button>
        <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5rem", justifyContent: "center", minHeight: "100vh" }}>
          <div className='goal-text' style={{marginTop: "-8rem", textAlign: "center", fontSize: "2.2rem", color:"white", }}>
            <h2>Choose Your Goal</h2>
          </div>
          <div className="goal-card">
            <div className="goal-list" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {categories.map((category) => {
                const isSelected = selectedCategory && selectedCategory.key === category.key;

                return (
                  <div
                    key={category.key}
                    className={`select-goal ${isSelected ? ' selected' : ''}`}
                    style={{
                      cursor: "pointer",
                      background: isSelected ? "#16997681" : "#17188baf",
                      border: isSelected ? "1px solid #8adca6ff" : "1px solid #0505de",
                      borderRadius: ".6rem",
                      padding: "1rem",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <RadioButton
                      inputId={category.key}
                      className="id"
                      name="category"
                      value={category}
                      onChange={(e) => setSelectedCategory(e.value)}
                      checked={isSelected}
                    />
                    <label htmlFor={category.key} className="idname ml-2" style={{ marginLeft: "1rem" }}>
                      {category.name}
                    </label>
                  </div>
                );
              })}
              <div className="action-buttons" style={{ display: "flex", gap: "1rem" }}>
                <button className="btn btn-primary"
                  style={{
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem",
                    position:"relative",
                    top:"2rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #0bdcf8ff ",
                    background: "#02013b",
                    color: "#fff",
                    opacity: !selectedCategory ? 0.5 : 1,
                    cursor: !selectedCategory ? "not-allowed" : "pointer"
                  }}
                  onClick={handleNext}
                  disabled={!selectedCategory}
                >
                  Next <MoveRight/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Goal

