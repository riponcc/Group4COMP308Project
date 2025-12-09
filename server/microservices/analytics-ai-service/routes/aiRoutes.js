import express from "express";
import { runAIQuery, runSummary } from "../controllers/aiController.js";

const router = express.Router();

router.post("/query", runAIQuery);
router.post("/summarize", runSummary);

export default router;

