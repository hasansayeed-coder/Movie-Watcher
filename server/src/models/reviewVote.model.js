import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const reviewVoteSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: true
  },
  voteType: {
    type: String,
    enum: ["like", "dislike"],
    required: true
  }
}, modelOptions);

// One vote per user per review — enforced at DB level
reviewVoteSchema.index({ user: 1, review: 1 }, { unique: true });

export default mongoose.model("ReviewVote", reviewVoteSchema);