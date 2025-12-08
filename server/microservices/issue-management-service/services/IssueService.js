// src/services/IssueService.js
export default class IssueService {
  constructor(IssueModel, issueAI) {
    this.Issue = IssueModel;
    this.issueAI = issueAI;
  }

  async createIssue(input, userId) {
    const { title, description, latitude, longitude, photoUrl } = input;

    // Call AI to enrich the issue
    const aiResult = await this.issueAI.analyze(description);

    const issue = new this.Issue({
      title,
      description,
      latitude,
      longitude,
      photoUrl,
      category: aiResult.category,
      urgency: aiResult.urgency,
      createdBy: userId,
    });

    await issue.save();
    return issue;
  }

  async listIssues(filter = {}) {
    const query = {};
    if (filter.status) query.status = filter.status;
    if (filter.category) query.category = filter.category;

    // 
    const issues = await this.Issue.find(query).sort({ createdAt: -1 }).exec();
    return issues.map(i => ({
      ...i._doc,
      id: i.id,
      createdAt: i.createdAt?.toISOString(),
      updatedAt: i.updatedAt?.toISOString()
    }));

  }

  async getIssueById(id) {
    return this.Issue.findById(id).exec();
  }

  async updateIssueStatus(id, newStatus) {
    return this.Issue.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    ).exec();
  }
}
