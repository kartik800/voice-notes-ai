import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToMongoDB from "./db/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inggest/index.js";
import notesRouter from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://voice-notes-ai-lac.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve audio files

app.use("/api/notes", notesRouter);

app.use("/api/inngest", serve({ client: inngest, functions }));

connectToMongoDB();
// const startServer = async () => {
//   try {
//     await connectToMongoDB();
//     // app.listen(PORT, () => {
//     //   console.log(" Server running on http://localhost:5000");
//     // });
//   } catch (err) {
//     console.error("Failed to start server:", err);
//   }
// };

// startServer();
