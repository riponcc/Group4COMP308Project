// issue-microservice.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';

// GraphQL + Models + Services
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import connectDB from './config/mongoose.js';
import IssueService from './services/IssueService.js';
import { IssueModel } from './models/Issue.js';
import { issueAI } from './services/issueAI.js';

// Initialize Express app
const app = express();
app.set('trust proxy', 1);

// -----------------------------------------------------
// CORS MUST BE FIRST
// -----------------------------------------------------
app.use(
  cors({
    origin: [
      'http://localhost:3000', // shell
      'http://localhost:3001', // user app
      'http://localhost:3002', // issue app
      'http://localhost:4000', // community?
      'https://studio.apollographql.com',
    ],
    credentials: true,
  })
);

app.options('*', cors());

// Other middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------------------
// MongoDB Connection
// -----------------------------------------------------
await connectDB();

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

  // Inject services
  const issueService = new IssueService(IssueModel, issueAI);

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let token = null;

        // 1) Try reading token from cookies
        if (req.cookies?.token) {
          token = req.cookies.token;
        }

        // 2) Try reading token from "Authorization: Bearer <token>"
        if (!token && req.headers.authorization) {
          const parts = req.headers.authorization.split(' ');
          if (parts.length === 2 && parts[0] === 'Bearer') {
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

startServer();
