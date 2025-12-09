// src/schema.js
import gql from "graphql-tag";

const typeDefs = gql`
  enum IssueStatus {
    OPEN
    IN_PROGRESS
    RESOLVED
    CLOSED
  }

  type Issue {
    id: ID!
    title: String!
    description: String!
    latitude: Float
    longitude: Float
    photoUrl: String
    category: String
    urgency: Int
    status: IssueStatus!
    createdBy: String!
    createdAt: String!
    updatedAt: String!
  }

  # AIAnalysis: result returned by the AI assistant for an issue
  type AIAnalysis {
    summary: String
    category: String
    urgency: Int
    tags: [String]
    suggestedAction: String
  }

  input CreateIssueInput {
    title: String!
    description: String!
    latitude: Float
    longitude: Float
    photoUrl: String
  }

  input IssueFilterInput {
    status: IssueStatus
    category: String
  }

  type Query {
   
    issues(filter: IssueFilterInput): [Issue!]!
    issue(id: ID!): Issue
    analyzeIssue(description: String!): AIAnalysis
    issueChatbot(input: String!): ChatbotResponse
  }

  type Mutation {
     createIssue(input: CreateIssueInput!): Issue!
    updateIssueStatus(id: ID!, status: IssueStatus!): Issue!
    summarizeIssue(issueId: ID!): AIAnalysis
  }
  type ChatbotResponse {
    text: String
    suggestedQuestions: [String]
    retrievedIssues: [Issue]
  }

`;

export default typeDefs;
