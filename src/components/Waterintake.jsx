import React, { useState, useEffect } from "react";
import { GlassWater, Minus, Plus, X } from "lucide-react";


const WaterIntake = () => {
  const [entries, setEntries] = useState([]);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [goal, setGoal] = useState(2000);
  const [isCustomPopupOpen, setIsCustomPopupOpen] = useState(false);

  const calculateGoal = () => {
    const base = weight * 33;
    const heightAdjustment = (height - 170) * 0.5;
    let ageAdjustment = 0;
    if (age < 20) ageAdjustment = 200;
    else if (age > 50) ageAdjustment = -200;
    else if (age > 65) ageAdjustment = -400;
    const total = base + heightAdjustment + ageAdjustment;
    return Math.max(1000, Math.round(total / 100) * 100);
  };

  // Load profile and entries from sessionStorage
  useEffect(() => {
    const savedHeight = sessionStorage.getItem("originalHeight");
    const savedWeight = sessionStorage.getItem("userWeight");
    const savedDOB = sessionStorage.getItem("userDOB");

    if (savedHeight) setHeight(Math.round(parseFloat(savedHeight)));
    if (savedWeight) setWeight(parseFloat(savedWeight));
    if (savedDOB) {
      const birthDate = new Date(savedDOB);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
      setAge(calculatedAge);
    }

    const savedEntries = sessionStorage.getItem("waterEntries");
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      const todayStr = new Date().toDateString();
      const todayEntries = parsedEntries.filter(
        (entry) => new Date(entry.timestamp).toDateString() === todayStr
      );
      setEntries(todayEntries);
    }
  }, []);


  useEffect(() => {
    sessionStorage.setItem("waterEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    setGoal(calculateGoal());
  }, [height, weight, age]);

  const addWater = (amount) => {
    if (amount <= 0) return;
    const newEntry = { amount, timestamp: new Date().toISOString() };
    setEntries((prev) => [...prev, newEntry]);
  };

  const removeLastWater = () => {
    const todayEntries = entries.filter(
      (entry) =>
        new Date(entry.timestamp).toDateString() === new Date().toDateString()
    );
    if (todayEntries.length > 0) {
      // Find the last entry from today and remove it from the main entries array
      const lastEntryTimestamp = todayEntries[todayEntries.length - 1].timestamp;
      setEntries(entries.filter(e => e.timestamp !== lastEntryTimestamp));
    }
  };
  const findLastIndex = (array, predicate) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  };
  const totalIntake = entries
    .filter(
      (entry) =>
        new Date(entry.timestamp).toDateString() === new Date().toDateString()
    )
    .reduce((sum, entry) => sum + entry.amount, 0);
  const progress = Math.min(100, (totalIntake / goal) * 100);
  const remaining = Math.max(0, goal - totalIntake);

  const Droplet = ({ value }) => {
    const buttonStyle = {
      background: "rgba(59, 130, 246, 0.15)",
      border: "1px solid rgba(59, 130, 246, 0.2)",
      color: "#3b82f6",
      borderRadius: "50%",
      width: 28,
      height: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 18px rgba(59,130,246,0.12)",
          }}
        >
          <GlassWater width={22} height={22} color="#3b82f6" />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => removeLastWater()}
            style={buttonStyle}
            aria-label={`Remove ${value}ml`}
          >
            <Minus size={16} />
          </button>
                  <div style={{ fontSize: 13, color: "#60a5fa", fontWeight: 700 }}>
          {value}ml
        </div>
          <button
            onClick={() => addWater(value)}
            style={buttonStyle}
            aria-label={`Add ${value}ml`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  };

  const presets = [250];

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const recordCustom = () => {
    setIsCustomPopupOpen(true);
  };

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const customAmounts = [150, 250, 500, 650];

  return (
    <>
      <div
        className="water-tracker"
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        {/* Top number + progress */}
        <div style={{ textAlign: "center", padding: "6px 8px" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#2563eb",
              lineHeight: 1,
            }}
          >
            {totalIntake}
          </div>
          <div style={{ marginTop: 6, color: "#475569", fontSize: 13 }}>
            <span style={{ fontWeight: 700, marginRight: 8 }}>
              {Math.round(progress)}% completed
            </span>
            Goal {goal} ml
          </div>
        </div>

        {/* droplets row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            marginTop: "0.7rem",
            marginBottom: "1rem",
            width: "160px",
          }}
        >
          {presets.map((p) => (
            <Droplet key={p} value={p} />
          ))}
        </div>

        {/* Record Drink button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "0.5rem",
          }}
        >
          <button
            onClick={recordCustom}
            style={{
              padding: "0.5rem 0.8rem",
              borderRadius: "0.8rem",
              border: "none",
              fontWeight: 800,
              fontSize: "1rem",
              border: "1px solid #0bdcf8ff ",
              background: "#02013b",
              color: "#fff",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(90deg, #1e3a8a, #06b6d4)";
            e.currentTarget.style.boxShadow = "0 0 12px #06b6d4";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#02013b";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            Record
          </button>
        </div>
      </div>
      {/* Custom Amount Popup */}
      {isCustomPopupOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            placeItems: "center",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsCustomPopupOpen(false)}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #0f172a, #030712)",
              padding: "1rem",
              borderRadius: 20,
              // width: "100%",
              minWidth: 300,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCustomPopupOpen(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "0.7rem",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3
              style={{
                marginTop: 0,
                marginBottom: "1.2rem",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "1.3rem",
              }}
            >
              Choose amount
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                justifyItems: "center",
              }}
            >
              {customAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    addWater(amount);
                    setIsCustomPopupOpen(false);
                  }}
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    color: "#93c5fd",
                    padding: "1rem 0.5rem",
                    borderRadius: 12,
                    cursor: "pointer",
                    width: "65%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.1)")
                  }
                >
                  <GlassWater size={24} color="#3b82f6" />
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {amount}{" "}
                    <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>ml</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WaterIntake;
