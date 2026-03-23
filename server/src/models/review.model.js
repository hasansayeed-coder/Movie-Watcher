// ✅ Full fixed file
import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const reviewSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  mediaType: { type: String, enum: ["tv", "movie"], required: true },
  mediaId: { type: String, required: true },
  mediaTitle: { type: String, required: true },
  mediaPoster: { type: String, required: true },
}, modelOptions);

reviewSchema.index({ user: 1, mediaId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);