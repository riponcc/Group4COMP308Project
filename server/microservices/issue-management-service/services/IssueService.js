// Basic issue service with CRUD + simple search
export default function makeIssueService({ IssueModel }) {
  async function listIssues(filter = {}) {
    return IssueModel.find(filter).limit(100).lean();
  }

  async function getIssueById(id) {
    return IssueModel.findById(id);
  }

  async function createIssue(input, userId) {
    const issue = new IssueModel({ ...input, createdBy: userId });
    return issue.save();
  }

  async function updateIssueStatus(id, status) {
    return IssueModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  // simple text search; replace with vector search in production
  async function searchIssuesByText(text, { limit = 5 } = {}) {
    // Use MongoDB text index if present
    try {
      return IssueModel.find({ $text: { $search: text } })
        .limit(limit)
        .lean();
    } catch (e) {
      // fallback: regex of first few tokens
      const tokens = text.split(/\s+/).slice(0, 5).join("|");
      const regex = new RegExp(tokens, "i");
      return IssueModel.find({
        $or: [{ title: regex }, { description: regex }],
      })
        .limit(limit)
        .lean();
    }
  }

  return {
    listIssues,
    getIssueById,
    createIssue,
    updateIssueStatus,
    searchIssuesByText,
  };
}
