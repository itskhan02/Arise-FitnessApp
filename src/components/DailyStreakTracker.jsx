import React, { useEffect, useMemo, useState, useRef } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const IconFire = ({ size = 20, color = "#ff7a18" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 2s1.5 2.2 1.5 4.2C13.5 9.2 12 11 12 11s2-1 3-1c1 0 3 1 3 4 0 3-2 6-8 6s-8-3-8-6c0-3 2-5 3-6 1-1 2-3 2-6 0 0 1 1.6 3 2.8z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const fmt = (d) => d.toISOString().slice(0, 10);

function ProgressRing({ size = 80, stroke = 8, progress = 0, label = "" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", flexShrink: 0 }}
    >
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />
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
        <foreignObject
          x={-(size / 2)}
          y={-(size / 2)}
          width={size}
          height={size}
        >
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
  storageKey = "streak-checked-days",
  title = "Daily Streak",
  userName = null,
  initialCheckedDays = null,
  onCheckedDaysChange = null,
}) => {
  const today = useMemo(() => fmt(new Date()), []);
  const [completedSet, setCompletedSet] = useState(new Set());
  const [skippedSet, setSkippedSet] = useState(new Set());
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Update width when screen resizes (responsive behavior)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Seed from parent or localStorage
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    try {
      if (
        initialCheckedDays &&
        Array.isArray(initialCheckedDays) &&
        initialCheckedDays.length > 0
      ) {
        setCompletedSet(new Set(initialCheckedDays));
        setSkippedSet(new Set());
        setLastSavedAt(new Date().toISOString());
        return;
      }

      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed) return;
      if (Array.isArray(parsed.completed))
        setCompletedSet(new Set(parsed.completed));
      if (Array.isArray(parsed.skipped)) setSkippedSet(new Set(parsed.skipped));
      if (parsed.savedAt) setLastSavedAt(parsed.savedAt);
    } catch (e) {
      console.warn("Failed to read streak from localStorage", e);
    }
  }, [storageKey, initialCheckedDays]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const payload = {
        completed: Array.from(completedSet),
        skipped: Array.from(skippedSet),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setLastSavedAt(payload.savedAt);
      if (typeof onCheckedDaysChange === "function") {
        onCheckedDaysChange(Array.from(completedSet));
      }
    } catch (e) {
      console.warn("Failed to write streak to localStorage", e);
    }
  }, [completedSet, skippedSet, storageKey, onCheckedDaysChange]);

  // Responsive history (depends on width)
  const history = useMemo(() => {
    const days = [];
    for (let i = 4; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(fmt(d));
    }

    let maxFuture;
    if (width >= 1280) maxFuture = 15;
    else if (width >= 1080) maxFuture = 15;
    else if (width >= 768) maxFuture = 15;
    else if (width >= 720) maxFuture = 15;
    else if (width >= 640) maxFuture = 15;
    else if (width >= 576) maxFuture = 11;
    else if (width >= 480) maxFuture = 15;
    else if (width >= 360) maxFuture = 11;
    else if (width >= 320) maxFuture = 11;
    else maxFuture = 5;

    days.push(today);
    for (let i = 1; i <= maxFuture; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(fmt(d));
    }
    return days;
  }, [width, today]);

  const progressWindow = 30;
  const completedLast30 = useMemo(() => {
    let count = 0;
    for (let i = 0; i < progressWindow; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (completedSet.has(fmt(d))) count++;
    }
    return count;
  }, [completedSet]);

  const progressPercent = Math.min(
    100,
    Math.round((completedLast30 / progressWindow) * 100)
  );

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const s = fmt(d);
      const weekday = d.getDay();
      if (weekday === 0) continue;
      if (completedSet.has(s)) streak++;
      else break;
    }
    return streak;
  }, [completedSet]);

  const bestStreak = useMemo(() => {
    const seen = new Set(Array.from(completedSet));
    let best = 0;
    let current = 0;
    for (let i = 365; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const s = fmt(d);
      const weekday = d.getDay();
      if (weekday === 0) continue;
      if (seen.has(s)) {
        current++;
        if (current > best) best = current;
      } else current = 0;
    }
    return best;
  }, [completedSet]);

  const target = 30;

  const checkInToday = () => {
    if (completedSet.has(today)) return;
    const nextCompleted = new Set(completedSet);
    nextCompleted.add(today);
    const nextSkipped = new Set(skippedSet);
    nextSkipped.delete(today);
    setCompletedSet(nextCompleted);
    setSkippedSet(nextSkipped);
  };

  // --- CSS styles kept 100% intact ---
  const card = {
    maxWidth: 600,
    width: "95%",
    margin: "0 auto",
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
    borderRadius: 20,
    padding: "2rem",
    color: "#fff",
    boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const titleRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };
  const gridWrap = {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    alignItems: "center",
  };

  const historyGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(45px, 1fr))",
    gap: 8,
  };

  const tileBase = {
    padding: 6,
    borderRadius: 10,
    minHeight: 65,
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
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
    <motion.div
      className="streak-card"
      style={card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* --- header --- */}
      <div style={titleRow}>
        <div>
          {userName && (
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#6b98f8ff",
                marginBottom: "0.5rem",
              }}
            >
              Hi, {userName} 👋
            </div>
          )}
          <div style={{ fontSize: "0.8rem", color: "#9aa6bf" }}>
            Stay consistent and achieve your goals!
          </div>
        </div>
        <motion.div style={{ textAlign: "right" }} whileHover={{ scale: 1.05 }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 900 }}>
            {currentStreak} 🔥
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9aa6bf" }}>
            Current Streak
          </div>
        </motion.div>
      </div>

      {/* --- progress --- */}
      <div className="streak-grid" style={gridWrap}>
        <div
          className="streak-left"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ProgressRing
            size={88}
            stroke={8}
            progress={progressPercent}
            label={`${progressPercent}%`}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>
              {bestStreak} days
            </div>
            <div style={{ fontSize: 10, color: "#9aa6bf" }}>
              Target: {target} days
            </div>
          </div>
        </div>

        <div
          className="streak-actions"
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
        >
          <motion.button
            onClick={checkInToday}
            disabled={completedSet.has(today)}
            whileHover={!completedSet.has(today) ? { scale: 1.05 } : {}}
            whileTap={!completedSet.has(today) ? { scale: 0.95 } : {}}
            style={{
              background: completedSet.has(today)
                ? "linear-gradient(90deg,#059669,#10b981)"
                : "linear-gradient(90deg,#6366f1,#06b6d4)",
              color: "#fff",
              padding: "0.75rem 0.8rem",
              borderRadius: 12,
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "1rem",
              fontWeight: 800,
              cursor: completedSet.has(today) ? "not-allowed" : "pointer",
              boxShadow: completedSet.has(today)
                ? "0 0 12px rgba(16,185,129,0.5)"
                : "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            <Check size={16} />{" "}
            {completedSet.has(today) ? "Checked In" : "Check In"}
          </motion.button>

          <div style={{ fontSize: 10, color: "#9aa6bf" }}>
            {lastSavedAt
              ? `Last saved: ${new Date(lastSavedAt).toLocaleString()}`
              : "Not saved yet"}
          </div>
        </div>
      </div>

      {/* --- history --- */}
      <div className="streak-history" style={historyGrid}>
        {history.map((d) => {
          const checked = completedSet.has(d);
          const dateObj = new Date(d);
          const weekday = dateObj.getDay();
          const isSunday = weekday === 0;
          const isFuture = dateObj > new Date();
          const isMissed = !checked && dateObj < new Date() && d !== today;
          const isToday = d === today;
          const style = { ...tileBase };

          if (checked) {
            style.background = "linear-gradient(180deg,#10b981,#34d399)";
            style.boxShadow = "0 0 8px rgba(16,185,129,0.5)";
          } else if (isSunday) {
            style.background = "rgba(56,189,248,0.15)";
            style.border = "1px dashed rgba(56,189,248,0.4)";
          } else if (isMissed) {
            style.background = "rgba(254,226,226,0.8)";
            style.border = "1px solid rgba(239,68,68,0.6)";
          } else {
            style.background = "rgba(255,255,255,0.05)";
            style.border = "1px solid rgba(255,255,255,0.05)";
          }
          if (isToday) style.border = "2px solid #38bdf8";
          const isInteractive = isToday && !checked;
          if (isInteractive) style.cursor = "pointer";

          return (
            <motion.div
              className="streak-tile"
              key={d}
              whileHover={
                isInteractive
                  ? { scale: 1.05, boxShadow: "0 0 10px rgba(255,255,255,0.2)" }
                  : {}
              }
              onClick={() => {
                if (isInteractive) checkInToday();
              }}
              style={{ ...style, height: 65 }}
            >
              <div style={{ fontSize: 10, opacity: 0.9 }}>
                {new Date(d)
                  .toLocaleDateString(undefined, { weekday: "short" })
                  .slice(0, 1)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 900 }}>
                {new Date(d).getDate()}
              </div>
              {checked && (
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: "#fff",
                    marginTop: 4,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DailyStreakTracker;
