// issue-microservice.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import fs from "fs";
import path from "path";

// GraphQL + Models + Services
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import connectDB from "./config/mongoose.js";
import IssueService from "./services/IssueService.js";
import { IssueModel } from "./models/Issue.js";

// AI wiring (LangChain + Gemini)
import makeModelClient from "./ai/modelClient.js"; // wrapper you already have
import makeIssueAI from "./services/issueAI.js";
//import makeIssueAI from "./services/issueAI.js";
 // factory style (makeIssueAI)
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Optional: user interaction model for chat history/audit logging (if present)
import UserInteraction from "./models/UserInteraction.js"; // create this if you haven't already

// -----------------------------------------------------
// Initialize Express app
// -----------------------------------------------------
const app = express();
app.set("trust proxy", 1);

// -----------------------------------------------------
// CORS MUST BE FIRST
// -----------------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000", // shell
      "http://localhost:3001", // user app
      "http://localhost:3002", // issue app
      "http://localhost:4000", // community?
      "https://studio.apollographql.com",
    ],
    credentials: true,
  })
);

app.options("*", cors());

// Other middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------------------
// MongoDB Connection
// -----------------------------------------------------
await connectDB();

// -----------------------------------------------------
// LangChain / Gemini setup
// -----------------------------------------------------
// IMPORTANT: Ensure GEMINI_API_KEY is present in your environment (.env)
// Example: GEMINI_API_KEY=ya29....
// If your environment expects GOOGLE_API_KEY instead, set that too.
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not found in env — Gemini calls will fail until you set it.");
}

// Create LangChain Chat model (Gemini)
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
  // optional: temperature, topP, etc.
  // If your LangChain version accepts an apiKey option, you can add: apiKey: process.env.GEMINI_API_KEY
  // Some deployments rely on GOOGLE_API_KEY env var; if needed set process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY
});

// Wrap the LangChain model in the small adapter your services expect (invoke([["human", prompt]]))
const aiModel = makeModelClient({ llm });

// Create the Issue-AI service (factory)
const issueAI = makeIssueAI({
  aiModel, // exposes invoke([[role, prompt]])
  IssueModel,
  UserInteractionModel: UserInteraction, // optional but recommended for audit/context
});

// -----------------------------------------------------
// Apollo Federation Subgraph Schema
// -----------------------------------------------------
const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({
  schema,
  introspection: true,
});

// -----------------------------------------------------
// START APOLLO SERVER
// -----------------------------------------------------
async function startServer() {
  await server.start();

  // Inject services into context
  // IssueService is a factory that expects a single options object
  const issueService = IssueService({ IssueModel, issueAI });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let token = null;

        // 1) Try reading token from cookies
        if (req.cookies?.token) {
          token = req.cookies.token;
        }

        // 2) Try reading token from "Authorization: Bearer <token>"
        if (!token && req.headers.authorization) {
          const parts = req.headers.authorization.split(" ");
          if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
          }
        }

        let user = null;

        // 3) Verify JWT
        if (token) {
          try {
            user = jwt.verify(token, process.env.JWT_SECRET);
          } catch (err) {
            console.warn("❌ Invalid token:", err.message);
          }
        }

        // Debugging:
        console.log("👉 Issue Microservice Received User:", user);

        return {
          req,
          res,
          user,
          isAuthenticated: !!user,
          issueService,
          issueAI,
        };
      },
    })
  );

  const PORT = process.env.ISSUE_SERVICE_PORT || 4002;

  app.listen(PORT, () => {
    console.log(`🚀 Issue Microservice running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error("Server start error:", err);
});
