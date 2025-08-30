import express from "express";
import multer from "multer";
import { inngest } from "../inngest.js";
import Note from "../models/Note.js";

const router = express.Router();

// storing audio and file setup
// console.log("environment variable is: ", process.env.MONGO_URI);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});
// console.log("storage is: ", storage);
const upload = multer({ storage });

// Routes:
// CREATE note (upload + trigger event)
router.post("/", upload.single("audio"), async (req, res) => {
  console.log(req.file); // file metadata
  console.log(req.body);
  try {
    const note = await Note.create({
      audioPath: req.file.path,
      transcript: "",
      summary: "",
    });

    //  Trigger Inngest event for transcription
    await inngest.send({
      name: "note/created",
      data: { noteId: note._id.toString(), audioPath: note.audioPath },
    });

    res.json(note); // return immediately, transcript will come later
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Trigger summary generation
router.post("/:id/summary", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    await inngest.send({
      name: "note/summarize",
      data: { noteId: note._id.toString(), transcript: note.transcript },
    });

    res.json({ message: "Summary generation queued" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to trigger summary" });
  }
});

//  CRUD (list, update, delete)
router.get("/", async (req, res) =>
  res.json(await Note.find().sort({ createdAt: -1 }))
);
router.put("/:id", async (req, res) => {
  const { transcript } = req.body;
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { transcript, summary: "" },
    { new: true }
  );
  res.json(note);
});
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
