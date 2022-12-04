import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  id: String,
  url: String,
  title: String,
  notes: String,
  tags: [String],
  date: Date,
  archived: Boolean,
  priority: Number,
});

export default mongoose.models.Link || mongoose.model("Link", linkSchema);
