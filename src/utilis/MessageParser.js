class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();
    if (lower.includes("diet") || lower.includes("meal")) {
      this.actionProvider.suggestDiet();
    } else if (lower.includes("calorie")) {
      this.actionProvider.explainCalories();
    } else if (lower.includes("protein")) {
      this.actionProvider.proteinTips();
    } else {
      this.actionProvider.defaultReply();
    }
  }
}

export default MessageParser;
