import { graph } from "../graph/basicGraph.js";

export const runAIQuery = async (req, res) => {
  const { question, sessionId } = req.body;

  if (!question || !sessionId) {
    return res.status(400).json({ error: "question and sessionId required" });
  }

  try {
    const result = await graph.invoke({ question, sessionId });
    res.json(result);
  } catch (err) {
    console.error("AI Query Error:", err);
    
    // Check if it's a quota/rate limit error
    if (err.status === 429 || err.message?.includes("quota") || err.message?.includes("rate limit")) {
      return res.status(429).json({ 
        error: "AI service is temporarily unavailable due to quota limits. Please try again in a few moments.",
        retryAfter: 60
      });
    }
    
    res.status(500).json({ error: "AI processing failed. Please try again later." });
  }
};

export const runSummary = async (req, res) => {
  const { question, sessionId } = req.body;

  try {
    const result = await graph.invoke({ question, sessionId });
    res.json({ summary: result.summary });
  } catch (err) {
    console.error("Summary Error:", err);
    
    // Check if it's a quota/rate limit error
    if (err.status === 429 || err.message?.includes("quota") || err.message?.includes("rate limit")) {
      return res.status(429).json({ 
        error: "AI service is temporarily unavailable due to quota limits. Please try again in a few moments.",
        retryAfter: 60
      });
    }
    
    res.status(500).json({ error: "Summary generation failed. Please try again later." });
  }
};
