import axios from "axios";

const api = axios.create({
  baseURL: "https://voice-notes-ai-6x8g.vercel.app/api/", // backend server
   withCredentials: true,
});

export default api;
