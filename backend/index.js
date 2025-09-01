import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToMongoDB from "./db/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inggest/index.js";
import notesRouter from "./routes/notes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",                   // local dev
  "https://voice-notes-ai-lac.vercel.app",  // frontend deployed
  "https://voice-notes-ai-6x8g.vercel.app"  // optional another frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman/server-to-server
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed by server"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve audio files

app.use("/api/notes", notesRouter);

app.use("/api/inngest", serve({ client: inngest, functions }));

const startServer = async () => {
  try {
    await connectToMongoDB();
    app.listen(5000, () => {
      console.log(" Server running on http://localhost:5000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
