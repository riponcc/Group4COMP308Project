function toIssueObject(issue) {
  if (!issue) return null;
  // Mongoose documents have _doc; plain objects from .lean() do not
  const doc = issue._doc ? issue._doc : issue;
  return {
    ...doc,
    id: doc.id || doc._id?.toString(),
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
  };
}

const resolvers = {
  Query: {
    issues: async (_, { filter }, { issueService }) => {
      const list = await issueService.listIssues(filter || {});
      return (list || []).map(toIssueObject);
    },

    issue: async (_, { id }, { issueService }) => {
      const issue = await issueService.getIssueById(id);
      return toIssueObject(issue);
    },

    analyzeIssue: async (_, { description }, { issueAI }) => {
      if (!issueAI) throw new Error("AI service unavailable");
      return issueAI.analyze(description);
    },

    issueChatbot: async (_, { input }, { user, issueAI, issueService }) => {
      // Allow anonymous queries; userId is optional for analytics/audit
      const retrieveFn = async (q) => issueService.searchIssuesByText(q, { limit: 5 });
      const userId = user ? (user.id || user._id) : null;
      const res = await issueAI.chatbotQuery({ input, userId, retrieveIssuesFn: retrieveFn });
      // normalize retrieved issues for GraphQL
      return {
        ...res,
        retrievedIssues: (res.retrievedIssues || []).map(toIssueObject),
      };
    },
  },

  Mutation: {
    createIssue: async (_, { input }, { user, issueService }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.id || user._id;
      if (!userId) throw new Error("User ID missing in authentication token");
      const created = await issueService.createIssue(input, userId);
      return toIssueObject(created);
    },

    updateIssueStatus: async (_, { id, status }, { user, issueService }) => {
      if (!user) throw new Error("Unauthorized");
      const updated = await issueService.updateIssueStatus(id, status);
      return toIssueObject(updated);
    },


    summarizeIssue: async (_, { issueId }, { user, issueAI }) => {
      // Allow anonymous summarization; userId is optional so we won't persist interactions if absent
      const userId = user ? (user.id || user._id) : null;
      const res = await issueAI.summarizeIssue(issueId, { userId });
      return {
        summary: res.aiSummary,
        category: res.category,
        urgency: res.urgency,
        tags: res.tags,
      };
    },
  },
};

export default resolvers;
