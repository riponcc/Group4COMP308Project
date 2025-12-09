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
    res.status(500).json({ error: "AI processing failed" });
  }
};

export const runSummary = async (req, res) => {
  const { question, sessionId } = req.body;

  try {
    const result = await graph.invoke({ question, sessionId });
    res.json({ summary: result.summary });
  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: "Summary failed" });
  }
};
