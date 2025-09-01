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
  "http://localhost:3000",                  // local dev
  "https://voice-notes-ai-lac.vercel.app", // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("CORS not allowed"));
  },
  credentials: true, // allow cookies/auth
}));

app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve audio files

app.use("/api/notes", notesRouter);

app.use("/api/inngest", serve({ client: inngest, functions }));

let cachedDB = null;

const connectDB = async () => {
  if (!cachedDB) {
    cachedDB = await connectToMongoDB();
    console.log("MongoDB connected");
  }
  return cachedDB;
};

// Wrap all requests to ensure DB is connected
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ------------------ Export serverless handler ------------------
export const handler = serverless(app);
