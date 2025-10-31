import React, { useEffect, useState } from "react";

const Motivation = () => {
  const motivationalQuotes = [
    "Push yourself because no one else is going to do it for you.",
    "It never gets easier, you just get stronger.",
    "Discipline will take you places motivation can’t.",
    "A year from now, you’ll wish you started today.",
    "Sweat now, shine later.",
    "Don’t stop when you’re tired, stop when you’re done.",
    "You are your only limit.",
    "Progress, not perfection.",
    "Consistency is greater than motivation.",
    "Train like a beast, look like a beauty.",
    "Pain is temporary, pride is forever.",
    "Fall in love with the process, and results will come.",
    "Every workout counts.",
    "You didn’t come this far to only come this far.",
    "Excuses change nothing, effort changes everything.",
    "Start where you are, use what you have, do what you can.",
    "Make yourself proud today.",
    "One workout a day keeps the excuses away.",
    "No shortcuts — just hard work.",
    "Be stronger than your strongest excuse.",
  ];

  const healthTips = [
    "Drink 2–3 liters of water daily.",
    "Sleep 7–8 hours every night.",
    "Stretch for 10 minutes post-workout.",
    "Add vegetables to every meal.",
    "Avoid sugary drinks — stay hydrated naturally.",
    "Take a 10-minute walk after meals.",
    "Eat more whole foods and fewer processed snacks.",
    "Start your day with protein and fiber.",
    "Meditate for at least 5 minutes daily.",
    "Avoid screens 30 minutes before bed.",
    "Replace soda with sparkling water + lemon.",
    "Don’t skip your warm-up and cool-down.",
    "Track your meals for a week — learn your habits.",
    "Balance your meals with protein and healthy fats.",
    "Take time to breathe and de-stress.",
    "Move every 30 minutes when sitting long.",
    "Avoid late-night heavy snacks.",
    "Focus on consistency over perfection.",
    "Practice gratitude for your body’s strength.",
    "Rest days are part of progress.",
  ];

  const [quote, setQuote] = useState("");
  const [tip, setTip] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();

    // Check if we already stored today's quote & tip
    const storedData = JSON.parse(localStorage.getItem("dailyMotivation"));
    if (storedData && storedData.date === today) {
      setQuote(storedData.quote);
      setTip(storedData.tip);
    } else {
      const randomQuote =
        motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

      const data = { date: today, quote: randomQuote, tip: randomTip };
      localStorage.setItem("dailyMotivation", JSON.stringify(data));

      setQuote(randomQuote);
      setTip(randomTip);
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: 500,
        width: "100%",
        margin: "0",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.95))",
        borderRadius: 20,
        padding: "1.5rem",
        color: "#fff",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* <h2
        style={{
          textAlign: "center",
          color: "#a78bfa",
          fontWeight: "600",
          marginBottom: "1.5rem",
          fontSize: "1.4rem",
        }}
      >
        ✨ Daily Motivation ✨
      </h2> */}

      <div
        // style={{
        //   background: "rgba(255,255,255,0.05)",
        //   borderRadius: "12px",
        //   padding: "1rem",
        //   border: "1px solid rgba(255,255,255,0.08)",
        // }}
      >
        <h4 style={{ 
          color: "#775acdff",
          fontWeight: "600",
          marginBottom: "0.8rem",
          fontSize: "1.4rem", 
          }}>
          Today's Qoute 
        </h4>
        <p style={{ fontSize: "1.2rem", color: "#e0e7ff", lineHeight: "1.5" }}>
          “{quote}”
        </p>
      </div>
{/* 
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          padding: "1rem",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h4 style={{ color: "#a78bfa",
          fontWeight: "600",
          marginBottom: "0.8rem",
          fontSize: "1.4rem", }}>
          🥗 Health Tip
        </h4>
        <p style={{ fontSize: "1rem", color: "#e0e7ff", lineHeight: "1.6" }}>
          {tip}
        </p>
      </div> */}
    </div>
  );
};

export default Motivation;
