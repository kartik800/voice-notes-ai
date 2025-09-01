import axios from "axios";

const api = axios.create({
  baseURL: "https://voice-notes-ai-6x8g-gt46qd8mi-kartik800s-projects.vercel.app/api/", // backend server
});

export default api;
