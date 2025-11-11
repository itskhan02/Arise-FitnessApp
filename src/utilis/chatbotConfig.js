import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "FitBot",
  initialMessages: [
    createChatBotMessage("👋 Hi! I’m FitBot — your diet & health assistant."),
    createChatBotMessage("Ask me about calories, meal plans, or workout nutrition!"),
  ],
};

export default config;
