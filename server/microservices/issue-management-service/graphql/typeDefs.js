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

  type AIAnalysis {
    category: String!
    urgency: Int!
    summary: String!
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
  }

  type Mutation {
    createIssue(input: CreateIssueInput!): Issue!
    updateIssueStatus(id: ID!, status: IssueStatus!): Issue!
    analyzeIssue(description: String!): AIAnalysis!
  }
`;

export default typeDefs;
