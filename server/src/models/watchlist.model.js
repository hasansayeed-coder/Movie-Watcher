import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const watchlistSchema = new mongoose.Schema({
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
  },
  watched: {
    type: Boolean,
    default: false       // false = want to watch, true = already watched
  }
}, modelOptions);

// Prevent duplicate entries for same user + media
watchlistSchema.index({ user: 1, mediaId: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);