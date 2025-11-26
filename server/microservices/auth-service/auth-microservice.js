import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

import { config } from "./config/config.js";
import connectDB from "./config/mongoose.js";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

// ==============================================
// ✅ ENVIRONMENT LOGS
// ==============================================
console.log("=============================================");
console.log("🔗 MongoDB URI:", config.db);
console.log("🔐 JWT_SECRET (length):", config.JWT_SECRET.length);
console.log("🚀 Auth Microservice running on port:", config.port);
console.log("=============================================");

// ==============================================
// ✅ CONNECT TO MONGODB
// ==============================================
connectDB();

// ==============================================
// ✅ INITIALIZE EXPRESS APP
// ==============================================
const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:4000",
      "https://studio.apollographql.com",
    ],
    credentials: true, // allow cookies
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==============================================
// ✅ BUILD APOLLO SUBGRAPH SCHEMA
// ==============================================
const schema = buildSubgraphSchema({ typeDefs, resolvers });

// ==============================================
// ✅ CREATE APOLLO SERVER INSTANCE
// ==============================================
const server = new ApolloServer({
  schema,
  introspection: true,
});

// ==============================================
// ✅ START SERVER ASYNC
// ==============================================
async function startServer() {
  await server.start();

  // Middleware for debugging requests
  app.use("/graphql", (req, res, next) => {
    console.log("📩 Incoming GraphQL operation:", req.body?.operationName || "Unknown");
    next();
  });

  // Attach Apollo GraphQL middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            user = { username: decoded.username, role: decoded.role };
            console.log("✅ Authenticated User:", user);
          } catch (err) {
            console.warn("⚠️ Invalid or expired JWT:", err.message);
          }
        }

        return { user, req, res };
      },
    })
  );

  // ✅ Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).send("Auth Microservice OK ✅");
  });

  // Start server
  app.listen(config.port, () =>
    console.log(`🚀 Auth Microservice ready at http://localhost:${config.port}/graphql`)
  );
}

startServer().catch((err) =>
  console.error("❌ Failed to start Auth Microservice:", err)
);
