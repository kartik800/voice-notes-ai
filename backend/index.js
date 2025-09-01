import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToMongoDB from "./db/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inggest/index.js";
import notesRouter from "./routes/notes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
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
