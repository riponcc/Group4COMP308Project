// services/issueAI.js
import makeModelClient from "../ai/modelClient.js";

export default function makeIssueAI({
  aiModel,
  IssueModel,
  UserInteractionModel = null,
}) {
  if (!aiModel) throw new Error("aiModel is required");

  async function callModel(prompt) {
    const res = await aiModel.invoke([["human", prompt]]);
    return res.content;
  }

  // -------------------------
  // ANALYZE ISSUE
  // -------------------------
  async function analyze(description) {
    const prompt = `You are an assistant that analyzes a civic issue description.
Respond with a JSON object only (no extra commentary) with the fields:
{
  "summary":"<one-sentence summary, 20-40 words>",
  "category":"<Pothole|Graffiti|Lighting|Sanitation|Noise|Other>",
  "urgency": <integer 1-5>,
  "tags": ["tag1","tag2"],
  "suggestedAction":"<short action for staff or citizen>"
}

Issue description:
"""${description}"""
`;

    const raw = await callModel(prompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: raw.trim() };
    }

    return {
      summary: parsed.summary || "",
      category: parsed.category || "Other",
      urgency: parsed.urgency ? Number(parsed.urgency) : 3,
      tags: parsed.tags || [],
      suggestedAction: parsed.suggestedAction || "",
      raw: parsed,
    };
  }

  // -------------------------
  // SUMMARIZE ISSUE
  // -------------------------
  async function summarizeIssue(issueId, { userId } = {}) {
    const issue = await IssueModel.findById(issueId);
    if (!issue) throw new Error("Issue not found");

    const prompt = `Summarize the following civic issue (title + description) in 2-4 sentences.
Also return JSON with fields: summary, category, urgency (1-5), tags (array).

Title: ${issue.title}
Description: ${issue.description}

Return JSON: { "summary": "...", "category":"...", "urgency": <1-5>, "tags": ["a","b","c"] }
`;

    const raw = await callModel(prompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: raw.trim() };
    }

    issue.aiSummary =
      parsed.summary ||
      (typeof raw === "string" ? raw.slice(0, 2000) : "");

    issue.category = parsed.category || issue.category;
    issue.urgency = parsed.urgency
      ? Number(parsed.urgency)
      : issue.urgency;

    issue.aiTags = parsed.tags || issue.aiTags || [];
    issue.updatedAt = new Date();

    await issue.save();

    if (UserInteractionModel && userId) {
      await UserInteractionModel.create({
        userId,
        query: `Summarize issue ${issueId}`,
        aiResponse: issue.aiSummary,
      });
    }

    return {
      issueId: issue.id,
      aiSummary: issue.aiSummary,
      category: issue.category,
      urgency: issue.urgency,
      tags: issue.aiTags,
    };
  }

  // -------------------------
  // CHATBOT QUERY
  // -------------------------
  async function chatbotQuery({ input, userId, retrieveIssuesFn = null }) {
    if (!input || input.trim().split(/\s+/).length < 3) {
      const clarifying =
        "Your query seems ambiguous. Could you please provide more details?";

      if (UserInteractionModel && userId) {
        await UserInteractionModel.create({
          userId,
          query: input,
          aiResponse: clarifying,
        });
      }

      return {
        text: clarifying,
        suggestedQuestions: ["Please elaborate on your query."],
        retrievedIssues: [],
      };
    }

    let pastContext = "";
    if (UserInteractionModel && userId) {
      const past = await UserInteractionModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3);
      pastContext = past
        .map((p) => `User: "${p.query}"\nAI: "${p.aiResponse}"`)
        .join("\n");
    }

    let retrievedIssues = [];
    if (retrieveIssuesFn) {
      retrievedIssues = await retrieveIssuesFn(input);
    }

    const retrievedText = retrievedIssues
      .map((r) => `${r.title}\n${r.description}`)
      .join("\n---\n");

    const augmentedQuery = `User Query: ${input}

Previous Interactions:
${pastContext}

Relevant Issues:
${retrievedText}

Please answer the user query concisely and suggest 3 follow-up questions.
Return JSON:
{
  "answer":"<text>",
  "suggestedQuestions":["q1","q2","q3"]
}`;
    const raw = await callModel(augmentedQuery);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { answer: raw };
    }

    const aiResponseText = parsed.answer || parsed.answer_text || raw;
    const suggestedQuestions =
      parsed.suggestedQuestions ||
      parsed.suggested_questions ||
      [];

    if (UserInteractionModel && userId) {
      await UserInteractionModel.create({
        userId,
        query: input,
        aiResponse: aiResponseText,
      });
    }

    return {
      text: aiResponseText,
      suggestedQuestions,
      retrievedIssues,
    };
  }

  return { analyze, summarizeIssue, chatbotQuery };
}

// 🔥 Provide named exports to avoid import errors
export { makeIssueAI };
export { makeIssueAI as issueAI };
