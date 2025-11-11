import { createChatBotMessage } from "react-chatbot-kit";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  suggestDiet = () => {
    const message = this.createChatBotMessage(
      "🥗 A balanced diet includes lean proteins, complex carbs, and healthy fats. Want me to suggest a 7-day plan?"
    );
    this.addMessageToState(message);
  };

  explainCalories = () => {
    const message = this.createChatBotMessage(
      "🔥 Calories are units of energy. For weight loss, aim to eat fewer than you burn daily."
    );
    this.addMessageToState(message);
  };

  proteinTips = () => {
    const message = this.createChatBotMessage(
      "💪 Protein helps muscle recovery. Include eggs, paneer, chicken, or lentils in your meals!"
    );
    this.addMessageToState(message);
  };

  defaultReply = () => {
    const message = this.createChatBotMessage(
      "I'm not sure about that — try asking about diet, calories, or protein!"
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
