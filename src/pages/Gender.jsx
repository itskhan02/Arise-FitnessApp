import { MoveRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Gender = ({ onSelect, selectedGender, onNext, onBack }) => {
    const [localSelected, setLocalSelected] = useState(selectedGender || null);
    const navigate = useNavigate();

    useEffect(() => {
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
        navigate("/height");
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
                className="heading" style={{color: "#fff", marginBottom: "2rem", }}>
                Select Your Gender
            </h2>

            <div
                className="options-grid"
                style={{
                    display: "flex",
                    gap: "2rem",
                    marginBottom: "2rem",
                    position: "relative",
                    height: "400px",
                    width: "100%",
                    maxWidth: "550px",
                }}
            >
                {/* Male Card */}
                <motion.div
                    className={`option-card ${localSelected === "male" ? "selected" : ""}`}
                    style={{
                        cursor: "pointer",
                        // border:
                        //     localSelected === "male"
                        //         ? "1px solid #8adca6ff"
                        //         : "1px solid #0505de",
                        // borderRadius: "1rem",
                        padding: "0.5rem 0.6rem",
                        // background: localSelected === "male" ? "#16997681" : "#17188baf",
                        color: "#fbfafaff",
                        minWidth: "250px",
                        width: "clamp(180px, 50vw, 250px)",
                        textAlign: "center",
                        position: "absolute",
                    }}
                    onClick={() => handleSelect("male")}
                    whileHover={localSelected !== "male" ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        x: localSelected === "female" ? -200 : localSelected === "male" ? 0 : -150,
                        x: localSelected === "female" ? "-80%" : localSelected === "male" ? "0%" : "-50%",
                        y: localSelected === "female" ? 20 : 0,
                        scale:
                            localSelected === "male"
                                ? 1.15
                                : localSelected === "female"
                                ? 0.9
                                : 0.95,
                        zIndex: localSelected === "male" ? 20 : localSelected === "female" ? 5 : 10,
                        opacity: localSelected === "female" ? 0.7 : 1,
                    }}
                    // transition={{ type: "spring", stiffness: 80, damping: 18, duration: 0.1, ease: "easeInOut" }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    <motion.img
                        src="/public/Male.png"
                        alt="Male"
                        style={{
                            width: "300px",
                            height: "370px",
                            width: "100%",
                            
                            marginBottom: "1rem",
                            objectFit: "contain",
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.1 }}
                    />
                    <h3>Male</h3>
                </motion.div>

                {/* Female Card */}
                <motion.div
                    className={`option-card ${localSelected === "female" ? "selected" : ""}`}
                    style={{
                        cursor: "pointer",
                        // border:
                        //     localSelected === "female"
                        //         ? "1px solid #8adca6ff"
                        //         : "1px solid #0505de",
                        borderRadius: "1rem",
                        padding: "0.5rem 0.7rem",
                        // background: localSelected === "female" ? "#1d896c81" : "#17188baf",
                        color: "#fff",
                        minWidth: "250px",
                        width: "clamp(180px, 50vw, 250px)",
                        textAlign: "center",
                        position: "absolute",
                    }}
                    onClick={() => handleSelect("female")}
                    whileHover={localSelected !== "female" ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        x: localSelected === "male" ? 200 : localSelected === "female" ? 0 : 150,
                        x: localSelected === "male" ? "80%" : localSelected === "female" ? "0%" : "50%",
                        y: localSelected === "male" ? 20 : 0,
                        scale:
                            localSelected === "female"
                                ? 1.15
                                : localSelected === "male"
                                ? 0.9
                                : 0.95,
                        zIndex: localSelected === "female" ? 20 : localSelected === "male" ? 5 : 10,
                        opacity: localSelected === "male" ? 0.7 : 1,
                    }}
                    // transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.1, ease: "easeInOut" }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    <motion.img
                        src="/public/Female.png"
                        alt="Female"
                        style={{
                            width: "300px",
                            height: "370px",
                            width: "100%",
                            marginBottom: "0.6rem",
                            objectFit: "contain",
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.1 }}
                    />
                    <h3>Female</h3>
                </motion.div>
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
