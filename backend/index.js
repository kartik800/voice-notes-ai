import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectToMongoDB from "./db/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inggest/index.js";
import serverless from "serverless-http";
import notesRouter from "./routes/notes.js";

const app = express();

//  Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:3000",
  "https://voice-notes-ai-lac.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", notesRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

//  Mongo connection cache
let cachedDB = null;
const connectDB = async () => {
  if (!cachedDB) {
    cachedDB = await connectToMongoDB();
    console.log("MongoDB connected");
  }
  return cachedDB;
};

// connect once at startup (both local + serverless cold start)
await connectDB();

//  Serverless handler for Vercel
const handler = serverless(app);
export default handler;

// Local dev mode (only runs if not serverless)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
  });
}
