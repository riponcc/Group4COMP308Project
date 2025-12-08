// src/models/Issue.js
import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    photoUrl: { type: String },

    // AI-enriched fields
    category: { type: String },
    urgency: { type: Number, min: 1, max: 5 },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },

    createdBy: { type: String, required: true }, // userId from JWT
  },
  { timestamps: true }
);

// For geospatial queries
IssueSchema.index({ latitude: 1, longitude: 1 });

export const IssueModel = mongoose.model("Issue", IssueSchema);
