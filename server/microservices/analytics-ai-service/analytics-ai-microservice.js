import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";
import { loadAndEmbedIssues } from "./graph/basicGraph.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// -------------------------------------
// MONGODB CONNECTION
// -------------------------------------
mongoose
  .connect(process.env.ISSUE_MONGO_URI)
  .then(async () => {
    console.log("📦 MongoDB connected for Analytics-AI Service");

    console.log("🔄 Loading & embedding issues...");
    await loadAndEmbedIssues();
    console.log("✅ Issue embeddings completed!");
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -------------------------------------
// API ROUTES
// -------------------------------------
app.use("/ai", aiRoutes);

// -------------------------------------
// START SERVER
// -------------------------------------
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Analytics-AI Microservice running on port ${PORT}`);
  console.log("🧠 Ready for LangGraph AI + MongoDB RAG");
});
