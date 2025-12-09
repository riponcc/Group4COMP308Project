// src/models/Issue.js
import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    photoUrl: String,

    category: String,
    urgency: { type: Number, min: 1, max: 5 },

    aiSummary: String,
    aiTags: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },

    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

// add indexes if desired
IssueSchema.index({ title: "text", description: "text" });
IssueSchema.index({ latitude: 1, longitude: 1 });

const IssueModel = mongoose.model("Issue", IssueSchema);

// export both named and default to avoid import headaches
export { IssueModel };
export default IssueModel;
