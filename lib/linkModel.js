import mongoose from "mongoose";

const defaultString = {
  type: String,
  default: "",
};

const linkSchema = new mongoose.Schema({
  id: Number,
  url: String,
  title: defaultString,
  notes: defaultString,
  tags: [defaultString],
  createdAt: Date,
  archived: Boolean,
  priority: Number,
});

const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);

let nextId;

export async function getNextId() {
  const lastLink = await Link.findOne().sort({ id: -1 });

  if (lastLink) {
    nextId = Number(lastLink.id) + 1;
  } else {
    nextId = 1;
  }

  return nextId;
}

export default Link;
