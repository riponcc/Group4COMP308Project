import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { z } from "zod";
import { StateGraph, START, END } from "@langchain/langgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Issue from "../models/Issues.js";
import { cosineSimilarity } from "./utils/cosineSimilarity.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Resolve directory properly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------------
// 1. SQLite Memory DB
// -------------------------------------------------------------------
const db = await open({
  filename: path.resolve(__dirname, "./chat_memory.db"),
  driver: sqlite3.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS memory (
    sessionId TEXT,
    question TEXT,
    answer TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function getChatHistory(sessionId) {
  return await db.all(
    `SELECT question, answer FROM memory WHERE sessionId = ? ORDER BY timestamp ASC`,
    sessionId
  );
}

async function saveToMemory(sessionId, question, answer) {
  await db.run(
    `INSERT INTO memory (sessionId, question, answer) VALUES (?, ?, ?)`,
    sessionId,
    question,
    answer
  );
}

// -------------------------------------------------------------------
// 2. LangGraph State Schema
// -------------------------------------------------------------------
const stateSchema = z.object({
  question: z.string(),
  sessionId: z.string(),
  answer: z.string().optional(),
  followUp: z.string().optional(),
  summary: z.string().optional(),
});

// -------------------------------------------------------------------
// 3. Gemini LLM + Embedding Model
// -------------------------------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const llm = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const embedModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

async function invokeGemini(prompt) {
  const result = await llm.generateContent(prompt);
  return result.response.text();
}

async function generateEmbedding(text) {
  const res = await embedModel.embedContent({
    content: { parts: [{ text }] },
  });
  return res.embedding.values;
}

// -------------------------------------------------------------------
// 4. Load + Embed Issues from MongoDB
// -------------------------------------------------------------------
let embeddedStore = [];

async function loadAndEmbedIssues() {
  console.log("📥 Loading issues from MongoDB...");

  const issues = await Issue.find().lean();

  embeddedStore = await Promise.all(
    issues.map(async (issue) => {
      const text = `${issue.title}\n${issue.description}`;
      const embedding = await generateEmbedding(text);
      return { id: issue._id.toString(), text, embedding };
    })
  );

  console.log(`✅ Embedded ${embeddedStore.length} issues.`);
}

// ❌ IMPORTANT — removed auto-execution here
// await loadAndEmbedIssues();

// Retrieval
async function retrieveRelevantContext(query, topK = 5) {
  const queryEmbedding = await generateEmbedding(query);

  return embeddedStore
    .map(({ id, text, embedding }) => ({
      id,
      text,
      score: cosineSimilarity(queryEmbedding, embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.text);
}

// -------------------------------------------------------------------
// 5. LangGraph Nodes
// -------------------------------------------------------------------
async function generate(state) {
  const { question, sessionId } = state;

  const context = await retrieveRelevantContext(question);
  const history = await getChatHistory(sessionId);

  const historyText = history
    .map((h) => `User: ${h.question}\nBot: ${h.answer}`)
    .join("\n");

  const prompt = `
You are a civic assistant analyzing real community issues from MongoDB.

Relevant issue data:
${context.join("\n")}

Conversation so far:
${historyText}

User Question:
${question}

Answer clearly and accurately:
  `;

  const answer = await invokeGemini(prompt);

  await saveToMemory(sessionId, question, answer);

  const followUpPrompt = `
Suggest 2 follow-up questions based on the conversation.

Conversation:
${historyText}

Answer:
${answer}
  `;

  const followUp = await invokeGemini(followUpPrompt);

  return { ...state, answer, followUp };
}

async function summarize(state) {
  const { sessionId, question, answer } = state;

  const history = await getChatHistory(sessionId);

  const historyText = history
    .map((h) => `User: ${h.question}\nBot: ${h.answer}`)
    .join("\n");

  const prompt = `
Summarize this chat session in 3–5 bullet points:

${historyText}

Latest:
User: ${question}
Assistant: ${answer}
  `;

  const summary = await invokeGemini(prompt);

  return { ...state, summary };
}

// -------------------------------------------------------------------
// 6. Build the Graph
// -------------------------------------------------------------------
const builder = new StateGraph(stateSchema)
  .addNode("generate", generate)
  .addNode("summarize", summarize)
  .addEdge(START, "generate")
  .addEdge("generate", "summarize")
  .addEdge("summarize", END);

export const graph = builder.compile();
export { loadAndEmbedIssues };

// -------------------------------------------------------------------
// 7. Export function to get all chat history for advocates
// -------------------------------------------------------------------
export async function getAllChatHistory() {
  try {
    const allHistory = await db.all(
      `SELECT sessionId, question, answer, timestamp 
       FROM memory 
       ORDER BY timestamp DESC 
       LIMIT 50`
    );
    return allHistory;
  } catch (err) {
    console.error("Error fetching chat history:", err);
    return [];
  }
}
