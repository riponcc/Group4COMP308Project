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
    createIssue: async (_, { input }, { user, issueService, io }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      // ⭐ FIX: choose correct ID field
      const userId = user.id || user._id;

      if (!userId) {
        console.error("❌ ERROR: Auth token missing user ID!", user);
        throw new Error("User ID missing in authentication token");
      }

      const newIssue = await issueService.createIssue(input, userId);

      // 🔔 Emit notification for new issue
      if (io) {
        io.emit('notification', {
          type: 'NEW_ISSUE',
          message: `New issue reported: ${newIssue.title}`,
          issue: newIssue,
          timestamp: new Date().toISOString(),
          urgency: newIssue.urgency >= 4 ? 'HIGH' : 'NORMAL'
        });
      }

      return newIssue;
    },

    updateIssueStatus: async (_, { id, status }, { user, issueService, io }) => {
      if (!user) throw new Error("Unauthorized");

      // optional: ensure only staff can update issues
      const updatedIssue = await issueService.updateIssueStatus(id, status);

      // 🔔 Emit notification for status change
      if (io) {
        io.emit('notification', {
          type: 'STATUS_UPDATE',
          message: `Issue status changed to ${status}`,
          issue: updatedIssue,
          status: status,
          timestamp: new Date().toISOString(),
        });
      }

      return updatedIssue;
    },

    analyzeIssue: async (_, { description }, { issueAI }) => {
      return issueAI.analyze(description);
    },
  },
};

export default resolvers;
