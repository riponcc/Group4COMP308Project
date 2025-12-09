import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  urgency: String,
  status: String,
  createdAt: Date,
});

export default mongoose.model("Issues", IssueSchema);
