import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { BiSend } from "react-icons/bi";
import IMG1 from "/public/Bot.png";
import IMG2 from "/public/bot1.png";
import BG from "/public/Botbg.png";


const FitBot = ({ userImage }) => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_GEMINI_MODEL_URL;
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const toggleChat = () => {
    setOpen(!open);
    if (!open && chat.length === 0) {
      setTimeout(() => {
        setChat([
          {
            id: "welcome",
            sender: "bot",
            text: "👋 Hi! I’m FitBot — your diet & health assistant. Ask me anything about diet, workouts, or fitness!",
          },
        ]);
      }, 200);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setChat((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    const botMsgId = Date.now() + 1;
    setChat((prev) => [...prev, { id: botMsgId, sender: "bot", text: "Typing..." }]);

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userInput }],
            },
          ],
        }),
      });

      const data = await response.json();

      let botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Sorry, I couldn’t process that. Please try again.";

      setChat((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, text: botReply } : msg
        )
      );
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: "⚠️ Something went wrong. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className="chat-button"
        onClick={toggleChat}
        style={{
          position: "fixed",
          // bottom: "3rem",
          // right: "2rem",
          background: "#2563eb",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {open ? <FaTimes size={24} /> : <FaComments size={24} />}
      </div>

      {/* Chat Window */}
      {open && (
        <div 
          className="chat-window"
          style={{
            position: "fixed",
            // bottom: "6rem",
            // right: "5rem",
            // width: "350px",
            // height: "480px",
            background: "#f9fafb",
            backgroundImage: `url(${BG})`,
            backgroundSize: "cover",
            border: "1px solid #ddd",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              textAlign: "center",
              padding: "6px",
              fontWeight: "bold",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: "1px solid #ddd",
            }}
          >
            <img
              src={IMG1}
              alt="FitBot Avatar"
              style={{ width: "2.7rem", height: "2.7rem", marginRight: "8px" }}
            />
            FitBot
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "0.4rem",
              overflowY: "auto",
              fontSize: "0.9rem",
              fontFamily: "Nunito",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "0.9rem",
            }}
          >
            {chat.map((msg) => (
              <div
                key={msg.id}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: "0.1rem",
                }}
              >
                {msg.sender === "bot" && (
                  <img
                    src={IMG2}
                    alt="FitBot Avatar"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                )}
                <span
                  style={{
                    background:
                      msg.sender === "user" ? "#2563eb" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "black",
                    padding: "8px 10px",
                    borderRadius: "15px",
                    maxWidth: "80%",
                    textAlign: "justify",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </span>
                {msg.sender === "user" && (
                  <img
                    src={userImage}
                    alt="User Avatar"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              border: "1px solid #2b2a2a",
              padding: "6px",
              margin: "0.6rem",
              borderRadius: "1.5rem",
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Ask FitBot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                color: "black",
                fontSize: "0.8rem",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              style={{
                color: "#2563eb",
                border: "none",
                padding: "6px 12px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <BiSend size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FitBot;
