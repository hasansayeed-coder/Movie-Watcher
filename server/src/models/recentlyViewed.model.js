import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const recentlyViewedSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaType: {
    type: String,
    enum: ["tv", "movie"],
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaTitle: {
    type: String,
    required: true
  },
  mediaPoster: {
    type: String,
    required: true
  },
  mediaRate: {
    type: Number,
    required: true
  }
}, modelOptions);

// Prevent full table scans on every lookup
recentlyViewedSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("RecentlyViewed", recentlyViewedSchema);