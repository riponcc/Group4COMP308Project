import express from "express";
import { runAIQuery, runSummary } from "../controllers/aiController.js";
import { getAllChatHistory } from "../graph/basicGraph.js";

const router = express.Router();

router.post("/query", runAIQuery);
router.post("/summarize", runSummary);

// New route for advocates to see chat history
router.get("/chat-history", async (req, res) => {
  try {
    const history = await getAllChatHistory();
    res.json({ success: true, history });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

