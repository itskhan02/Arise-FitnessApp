import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { BiSend } from "react-icons/bi";
import IMG1 from "/Bot.png";
import IMG2 from "/bot1.png";

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
            text: "👋Hi! I’m FitBot - your diet & health assistant. Ask me anything about diet, workouts, or fitness!",
          },
        ]);
      }, 500);
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

    // Prepare chat history for the API
    const history = chat
      .filter(msg => msg.id !== 'welcome') // Exclude the initial welcome message
      .map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            ...history, // Send previous messages
            { role: "user", parts: [{ text: userInput }] }, // Send the new message
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();

      let botReply;
      if (data.candidates && data.candidates.length > 0) {
        botReply = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback?.blockReason) {
        botReply = `⚠️ My apologies, I cannot respond to that. Reason: ${data.promptFeedback.blockReason}.`;
      } else {
        botReply = "⚠️ Sorry, I couldn’t process that. Please try again.";
      }

      setChat((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, text: botReply } : msg
        )
      );
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setChat((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: `⚠️ Something went wrong. ${err.message}` }
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
          background: "#3b82f6",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
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
            backgroundColor: "rgba(52, 53, 65, 0.8)",
            // backgroundImage: `url(${BG})`,
            // backgroundSize: "200px",
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "center",
            border: "1px solid #ddd",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "1px 2px 19px rgba(137, 140, 142, 1) inset",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "rgba(52, 53, 65, 0.8) i",
              color: "white",
              textAlign: "center",
              padding: "6px",
              fontWeight: "bold",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: "1px solid #ddd",
              boxShadow: "1px 2px 19px rgba(137, 140, 142, 1) inset",

            }}
          >
            <img
              src={IMG1}
              alt="FitBot Avatar"
              style={{ width: "2.7rem", height: "2.7rem", }}
            />
            FitBot
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              paddingTop: "0.8rem",
              paddingLeft: "0.8rem",
              paddingRight: "0.8rem",
              overflowY: "auto",
              fontSize: "0.9rem",
              fontFamily: "Nunito",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "1rem",
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
                    style={{ width: "3rem", height: "3rem" }}
                  />
                )}
                <span
                  style={{
                    background: msg.sender === "user" ? "#3b82f6" : "#444654", 
                    color: "white",
                    padding: "8px 10px",
                    borderRadius: msg.sender === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0", 
                    fontWeight: "500",
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
              border: "1px solid #766f6fff",
              padding: "6px",
              margin: "0.8rem",
              borderRadius: "1.5rem",
              background: "#40414f",
              boxShadow: "1px 2px 10px rgba(118, 111, 111, 1) inset",
            }}
          >
            <input
              type="text"
              placeholder="Ask FitBot..."
              placeholderTextColor="#f7f7f7ff"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#f7f7f8ff",
                fontFamily: "Nunito",
                fontWeight: "500",
                marginLeft: "0.5rem",
                fontSize: "0.9rem",
                
              }}
              
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              style={{
                color: "#cad9f8ff",
                border: "none",
                background: "transparent",
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
