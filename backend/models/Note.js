import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  audioPath: String,
  transcript: { type: String, default: "" },
  summary: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);
