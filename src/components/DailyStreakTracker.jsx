import React, { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const fmt = (d) => d.toISOString().slice(0, 10);

function ProgressRing({ size = 80, stroke = 8, progress = 0, label = "" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} strokeWidth={stroke} fill="none" stroke="rgba(255,255,255,0.08)" />
        <circle
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90)"
          stroke="#10b981"
        />
        <foreignObject x={-(size / 2)} y={-(size / 2)} width={size} height={size}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#dbeafe",
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.9 }}>Progress</div>
            <div style={{ fontSize: 14 }}>{label}</div>
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}

const DailyStreakTracker = ({
  storageKey = null,
  userName = null,
  initialCheckedDays = [],
  onCheckedDaysChange,
}) => {
  const [today] = useState(() => fmt(new Date()));


  const [completedSet, setCompletedSet] = useState(() => new Set(initialCheckedDays || []));

  useEffect(() => {
    if (initialCheckedDays && initialCheckedDays.length > 0) {
      setCompletedSet(new Set(initialCheckedDays));
    }
  }, [initialCheckedDays]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.completed) ? parsed.completed : null;
        if (arr) setCompletedSet(new Set(arr));
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const persist = (set) => {
    if (!storageKey) return;
    try {
      const arr = Array.from(set);
      localStorage.setItem(storageKey, JSON.stringify({ completed: arr, savedAt: new Date().toISOString() }));
    } catch (e) {
      console.warn("Failed to persist streak data", e);
    }
  };

  const handleSetCompleted = (newSet) => {
    setCompletedSet(newSet);
    if (onCheckedDaysChange) onCheckedDaysChange(Array.from(newSet));
    persist(newSet);
  };

  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const history = useMemo(() => {
    const days = [];
    for (let i = 4; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(fmt(d));
    }
    days.push(today);
    const maxFuture = width >= 576 ? 11 : 5;
    for (let i = 1; i <= maxFuture; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(fmt(d));
    }
    return days;
  }, [width, today]);

  const checkInToday = () => {
    const weekday = new Date(today).getDay();
    if (weekday === 0) return; // Sunday doesn't require check-in
    if (!completedSet.has(today)) {
      const nextCompleted = new Set(completedSet);
      nextCompleted.add(today);
      handleSetCompleted(nextCompleted);
    }
  };

  const isPast = (s) => s < today;

  // Compute current streak (sunday automatically counts)
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const s = fmt(d);
      const weekday = d.getDay();
      if (weekday === 0) {
        streak++; 
        continue;
      }
      if (completedSet.has(s)) streak++;
      else break;
    }
    return streak;
  }, [completedSet]);

  const bestStreak = useMemo(() => {
    let best = 0,
      current = 0;
    const seen = new Set(Array.from(completedSet));
    for (let i = 365; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const s = fmt(d);
      const weekday = d.getDay();
      if (weekday === 0) {
        current++;
        if (current > best) best = current;
        continue;
      }
      if (seen.has(s)) {
        current++;
        if (current > best) best = current;
      } else current = 0;
    }
    return best;
  }, [completedSet]);

  const progressWindow = 30;
  const completedLast30 = useMemo(() => {
    let count = 0;
    for (let i = 0; i < progressWindow; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const weekday = d.getDay();
      if (weekday === 0) {
        count++;
        continue;
      }
      if (completedSet.has(fmt(d))) count++;
    }
    return count;
  }, [completedSet]);

  const progressPercent = Math.min(100, Math.round((completedLast30 / progressWindow) * 100));

  const card = {
    maxWidth: 600,
    width: "100%",
    margin: "0 ",
    minHeight: 420,
    background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
    borderRadius: 20,
    padding: "1rem 1.8rem",
    color: "#fff",
    boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    gap: "1.5rem",
  };

  const titleRow = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" };
  const gridWrap = { display: "flex", flexDirection: "row", gap: 16, justifyContent: "space-between", alignItems: "center" };
  const historyGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(45px, 1fr))", gap: 8 };
  const tileBase = {
    padding: 6,
    borderRadius: 10,
    minHeight: 65,
    background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
    boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    transition: "all 0.3s ease",
  };

  return (
    <motion.div className="streak-card" style={card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      {/* Header */}
      <div style={titleRow}>
        <div>
          {userName && (
            <div style={{ fontSize: "1.3rem", fontWeight: 600, color: "#6b98f8ff", marginBottom: "0.5rem" }}>
              Hi, {userName} 👋
            </div>
          )}
          <div style={{ fontSize: "0.8rem", color: "#9aa6bf" }}>Stay consistent and achieve your goals!</div>
        </div>
        <motion.div style={{ textAlign: "right" }} whileHover={{ scale: 1.05 }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 900 }}>{currentStreak} 🔥</div>
          <div style={{ fontSize: "0.75rem", color: "#9aa6bf" }}>Current Streak</div>
        </motion.div>
      </div>

      {/* Progress */}
      <div className="streak-grid" 
      // style={gridWrap}
      >
        <div className="streak-left" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <ProgressRing size={88} stroke={8} progress={progressPercent} label={`${progressPercent}%`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>{bestStreak} days</div>
            <div style={{ fontSize: 10, color: "#9aa6bf" }}>Target: 30 days</div>
          </div>
        </div>

        <div className="streak-actions" style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <motion.button
            onClick={checkInToday}
            disabled={completedSet.has(today) || new Date(today).getDay() === 0}
            whileHover={!completedSet.has(today) && new Date(today).getDay() !== 0 ? { scale: 1.05 } : {}}
            whileTap={!completedSet.has(today) && new Date(today).getDay() !== 0 ? { scale: 0.95 } : {}}
            style={{
              background: completedSet.has(today) || new Date(today).getDay() === 0 ? "linear-gradient(90deg,#059669,#10b981)" : "linear-gradient(90deg,#6366f1,#06b6d4)",
              color: "#fff",
              padding: "0.75rem 0.8rem",
              borderRadius: 12,
              minWidth: 160,
              width: "100%",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "1rem",
              fontWeight: 800,
              cursor: completedSet.has(today) || new Date(today).getDay() === 0 ? "not-allowed" : "pointer",
              boxShadow: completedSet.has(today) || new Date(today).getDay() === 0 ? "0 0 12px rgba(16,185,129,0.5)" : "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            <Check size={16} /> {new Date(today).getDay() === 0 ? "Rest" : completedSet.has(today) ? "Checked In" : "Check In"}
          </motion.button>
        </div>
      </div>

      {/* History */}
      <div className="streak-history" style={historyGrid}>
        {history.map((d) => {
          const checked = completedSet.has(d);
          const dateObj = new Date(d);
          const weekday = dateObj.getDay();
          const isSunday = weekday === 0;
          const isToday = d === today;
          const style = { ...tileBase };

          // Visual rules:
          // - Sunday: keep special "rest" styling
          // - Checked (Mon-Sat): green
          // - Missed: red (only if date < today and not checked and not sunday)
          // - Future: default/neutral
          if (isSunday) {
            style.background = "rgba(56,189,248,0.15)";
            style.border = "1px dashed rgba(56,189,248,0.4)";
          } else if (checked) {
            style.background = "linear-gradient(180deg,#10b981,#34d399)";
            style.boxShadow = "0 0 8px rgba(16,185,129,0.5)";
          } else if (isPast(d)) {
            // only mark as missed if strictly before today
            style.background = "rgba(254,226,226,0.85)";
            style.border = "1px solid rgba(239,68,68,0.6)";
            style.color = "#7f1d1d";
          }

          if (isToday) style.border = "2px solid #38bdf8";

          return (
            <motion.div
              key={d}
              className="streak-tile"
              whileHover={isToday && !checked && weekday !== 0 ? { scale: 1.05, boxShadow: "0 0 10px rgba(255,255,255,0.2)" } : {}}
              onClick={() => {
                if (isToday && !checked && weekday !== 0) checkInToday();
              }}
              style={{ ...style, height: 65 }}
            >
              <div style={{ fontSize: 10, opacity: 0.9 }}>
                {isSunday ? "R" : dateObj.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 900 }}>{dateObj.getDate()}</div>
              {isSunday && (
                <div style={{ fontSize: 10, color: "#38bdf8", marginTop: 2 }}>Rest</div>
              )}
              {checked && !isSunday && (
                <div style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", marginTop: 4 }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DailyStreakTracker;


