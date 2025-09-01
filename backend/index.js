import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import connectToMongoDB from "./db/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inggest/index.js";
import notesRouter from "./routes/notes.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = ["https://voice-notes-ai-lac.vercel.app"];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"), false);
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/notes", notesRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (!isConnected) {
    await connectToMongoDB();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Export for Vercel serverless
export const handler = serverless(app);
