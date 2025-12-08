// src/resolvers.js
const resolvers = {
  Query: {
    issues: async (_, { filter }, { issueService }) => {
      return issueService.listIssues(filter || {});
    },

    issue: async (_, { id }, { issueService }) => {
      const issue = await issueService.getIssueById(id);
      return {
        ...issue._doc,
        id: issue.id,
        createdAt: issue.createdAt?.toISOString(),
        updatedAt: issue.updatedAt?.toISOString(),
      };
    },
  },

  Mutation: {
    createIssue: async (_, { input }, { user, issueService }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      // ⭐ FIX: choose correct ID field
      const userId = user.id || user._id;

      if (!userId) {
        console.error("❌ ERROR: Auth token missing user ID!", user);
        throw new Error("User ID missing in authentication token");
      }

      return issueService.createIssue(input, userId);
    },

    updateIssueStatus: async (_, { id, status }, { user, issueService }) => {
      if (!user) throw new Error("Unauthorized");

      // optional: ensure only staff can update issues
      return issueService.updateIssueStatus(id, status);
    },

    analyzeIssue: async (_, { description }, { issueAI }) => {
      return issueAI.analyze(description);
    },
  },
};

export default resolvers;
