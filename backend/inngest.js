import { Inngest } from "inngest";

// Create an Inngest client
export const inngest = new Inngest({
  id: "voice-notes-ai",
  name: "Voice Notes AI",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
