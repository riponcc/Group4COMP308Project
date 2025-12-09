import React from "react";
import AIChatbot from "../ai/AIChatbot";

export default function ResidentAI() {
  return (
    <AIChatbot
      welcomeMessage="Hi! I can help you understand your issues, track updates, or ask about services in your neighborhood."
    />
  );
}
