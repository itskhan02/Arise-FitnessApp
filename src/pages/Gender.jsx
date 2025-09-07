import { MoveRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Gender = ({ onSelect, selectedGender, onNext, onBack }) => {
    const [localSelected, setLocalSelected] = useState(selectedGender || null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load gender from sessionStorage on mount
        const savedGender = sessionStorage.getItem("userGender");
        if (savedGender) {
            setLocalSelected(savedGender);
            if (onSelect) onSelect(savedGender);
        }
    }, [onSelect]);

    const handleSelect = (gender) => {
        setLocalSelected(gender);
        sessionStorage.setItem("userGender", gender);
        if (onSelect) onSelect(gender);
    };

    const handleNext = () => {
        if (onNext) onNext(localSelected);
        navigate("/goal");
    };

    const handleBack = () => {
        if (onBack) onBack();
        navigate(-1);
    };

    return (
        <div
            className="gender-page"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
                justifyContent: "center",
                minHeight: "100vh",
                background: "#00002e",
                boxShadow: "0 0 30px 5px #3a1c71 inset",
                overflow: "hidden",
            }}
        >
            <h2
                className="gender"
                style={{
                    color: "#fff",
                    marginBottom: "2rem",
                    fontSize: "1.8rem",
                    fontWeight: "600",
                }}
            >
                Select Your Gender
            </h2>
            <div
                className="options-grid"
                style={{
                    display: "flex",
                    gap: "2rem",
                    marginBottom: "2rem",
                }}
            >
                <div
                    className={`option-card ${localSelected === "male" ? "selected" : ""}`}
                    style={{
                        cursor: "pointer",
                        border:
                            localSelected === "male"
                                ? "1px solid #8adca6ff"
                                : "1px solid #0505de",
                        borderRadius: "1rem",
                        padding: "2rem 1.5rem",
                        background: localSelected === "male" ? "#16997681" : "#17188baf",
                        color: "#fbfafaff",
                        minWidth: "140px",
                        textAlign: "center",
                        position: "relative",
                    }}
                    onClick={() => handleSelect("male")}
                >
                    {localSelected === "male" && (
                        <div
                            className="checkmark"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                color: "#fefefeff",
                            }}
                        >
                            ✓
                        </div>
                    )}
                    <div
                        className="option-icon male-icon"
                        style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
                    ></div>
                    <h3>Male</h3>
                </div>

                <div
                    className={`option-card ${localSelected === "female" ? "selected" : ""}`}
                    style={{
                        cursor: "pointer",
                        border:
                            localSelected === "female"
                                ? "1px solid #8adca6ff"
                                : "1px solid #0505de",
                        borderRadius: "1rem",
                        padding: "2rem 1.5rem",
                        background: localSelected === "female" ? "#1d896c81" : "#17188baf",
                        color: "#fff",
                        minWidth: "140px",
                        textAlign: "center",
                        position: "relative",
                    }}
                    onClick={() => handleSelect("female")}
                >
                    {localSelected === "female" && (
                        <div
                            className="checkmark"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                color: "#fc53a7ff",
                            }}
                        >
                            ✓
                        </div>
                    )}
                    <div
                        className="option-icon female-icon"
                        style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
                    ></div>
                    <h3>Female</h3>
                </div>
            </div>

            <div className="action-buttons" style={{ display: "flex", gap: "1rem" }}>
                <button
                    className="btn btn-primary"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #0bdcf8ff ",
                        background: "#02013b",
                        color: "#fff",
                        opacity: !localSelected ? 0.5 : 1,
                        cursor: !localSelected ? "not-allowed" : "pointer",
                    }}
                    onClick={handleNext}
                    disabled={!localSelected}
                >
                    Next <MoveRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Gender;
