import { Inngest } from "inngest";
import fs from "fs";
import OpenAI from "openai";
import Note from "../../models/Note.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "voice-notes-ai" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your_key",
});

// Transcription worker
const transcribeFn = inngest.createFunction(
  { id: "transcribe-note" },
  { event: "note/created" },
  async ({ event }) => {
    const { noteId, audioPath } = event.data;
    const note = await Note.findById(noteId);
    if (!note) return { error: "Note not found" };

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    note.transcript = transcription.text;
    await note.save();

    return { message: "Transcript saved", transcript: note.transcript };
  }
);

const summarizeFn = inngest.createFunction(
  { id: "summarize-note" },
  { event: "note/summarize" },
  async ({ event }) => {
    const { noteId, transcript } = event.data;
    const note = await Note.findById(noteId);
    if (!note) return { error: "Note not found" };

    const summaryResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize voice notes into 2-3 sentences.",
        },
        { role: "user", content: transcript },
      ],
    });

    note.summary = summaryResp.choices[0].message.content;
    await note.save();

    return { message: "Summary saved", summary: note.summary };
  }
);

export const functions = [transcribeFn, summarizeFn];
