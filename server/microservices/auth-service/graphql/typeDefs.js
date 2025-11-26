import gql from "graphql-tag";

const typeDefs = gql`
  # =========================================================
  # Federation support
  # =========================================================
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.6",
      import: ["@key"]
    )

  # =========================================================
  # User Entity (shared with other services)
  # =========================================================
  type User @key(fields: "id") {
  id: ID!
  username: String!
  email: String!
  role: String!
  createdAt: String!
  token: String
}


  # =========================================================
  # Queries
  # =========================================================
  type Query {
    users: [User!]!
    user(id: ID!): User
    currentUser: User
  }

  # =========================================================
  # Mutations
  # =========================================================
  type Mutation {
    login(username: String!, password: String!): User!
    register(username: String!, email: String!, password: String!, role: String!): User!
    logout: Boolean!
  }
`;

export default typeDefs;
