import { Inngest } from "inngest";
import fs from "fs";
import Note from "../../models/Note.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "voice-notes-ai" });

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Transcription worker
const transcribeFn = inngest.createFunction(
  { id: "transcribe-note" },
  { event: "note/created" },
  async ({ event }) => {
    console.log("even is: ", event);
    const { noteId, audioPath } = event.data;
    const note = await Note.findById(noteId);
    if (!note) return { error: "Note not found" };

    // Load audio file and encode as base64
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString("base64");

    // Call Gemini for speech-to-text
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const transcription = await model.generateContent([
      {
        inlineData: {
          data: audioBase64,
          mimeType: "audio/webm", // adjust if .wav / .mp3
        },
      },
      { text: "Transcribe this audio into English (en-US) text only." },
    ]);

    const transcriptText = transcription.response.text();
    console.log("transcript text is: ", transcriptText);
    note.transcript = transcriptText;
    await note.save();
    console.log("trascript saved in the db");
    return { message: "Transcript saved", transcript: note.transcript };
  }
);

// Summarization worker
const summarizeFn = inngest.createFunction(
  { id: "summarize-note" },
  { event: "note/summarize" },
  async ({ event }) => {
    const { noteId, transcript } = event.data;
    const note = await Note.findById(noteId);
    if (!note) return { error: "Note not found" };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const summaryResp = await model.generateContent(
      `Summarize the following note in 2-3 sentences:\n\n${transcript}`
    );

    note.summary = summaryResp.response.text();
    await note.save();

    return { message: "Summary saved", summary: note.summary };
  }
);

export const functions = [transcribeFn, summarizeFn];
