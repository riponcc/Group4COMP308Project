// src/ai/issueAI.js
// This module encapsulates AI logic (Strategy pattern-ish).

// Example: you can later plug LangGraph / Gemini / OpenAI here.
export const issueAI = {
  /**
   * Analyze an issue description and return:
   * - predicted category (generative / classification)
   * - urgency 1–5 (e.g., from a simple DL model)
   * - short summary (LLM)
   */
  async analyze(description) {
    // ⚠️ Placeholder logic – replace with actual AI call
    // e.g., call your LangGraph pipeline or Gemini endpoint here.

    // VERY simple rule-based fallback (for now):
    let category = "GENERAL";
    if (description.toLowerCase().includes("pothole")) category = "ROAD";
    if (description.toLowerCase().includes("water")) category = "WATER";
    if (description.toLowerCase().includes("light")) category = "ELECTRICITY";
    if (description.toLowerCase().includes("park")) category = "PARKS";

    const urgency = description.toLowerCase().includes("urgent") ? 5 : 3;

    const summary = `Reported issue about "${description.slice(0, 60)}..." categorized as ${category} with urgency ${urgency}.`;

    return { category, urgency, summary };
  },
};
