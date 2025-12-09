import React from "react";
import AIChatbot from "../ai/AIChatbot";

export default function StaffAI() {
  return (
    <AIChatbot
      welcomeMessage="Hello Staff! Ask me about issue triage, prioritization, workload, safety alerts, or trend summaries."
    />
  );
}
