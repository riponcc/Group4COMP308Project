import mongoose from "mongoose";

const UserInteractionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    query: { type: String, required: true },
    aiResponse: { type: String },
  },
  { timestamps: true }
);

// Export default to match existing imports
const UserInteraction = mongoose.model("UserInteraction", UserInteractionSchema);
export default UserInteraction;
