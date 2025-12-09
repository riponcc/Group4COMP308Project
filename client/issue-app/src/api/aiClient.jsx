// issue-app/src/api/aiClient.js

// You can override this in Vite with VITE_AI_BASE_URL
const AI_BASE_URL =
  import.meta.env.VITE_AI_BASE_URL || "http://localhost:5005/ai";

/**
 * Send a natural language question to the AI service.
 * @param {string} question
 * @param {string} sessionId
 */
export async function sendAIQuery(question, sessionId) {
  const res = await fetch(`${AI_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, sessionId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `AI query failed: ${res.status} ${res.statusText} - ${text}`
    );
  }

  return res.json(); // { question, answer, followUp, summary? }
}

/**
 * Ask the AI service for a summary of the session.
 * (Optional – only if you wire it into the UI)
 */
export async function requestSummary(question, sessionId) {
  const res = await fetch(`${AI_BASE_URL}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, sessionId }),
  });

  if (!res.ok) {
    throw new Error("Summary request failed");
  }

  return res.json(); // { summary }
}
