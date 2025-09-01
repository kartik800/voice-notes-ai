import { useState, useRef } from "react";
import api from "../api";

export default function Recorder({ onUploaded }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        console.log("part-1");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "note.webm");

        console.log("part-2");
        console.log([...formData.entries()]);
        const { data } = await api.post("/notes", formData);

        console.log("data is: ", data);

        console.log("part-3");
        onUploaded(data);
        console.log("part-4");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  }

  return (
    <div className="flex justify-center my-6">
      {recording ? (
        <button
          onClick={stopRecording}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600"
        >
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="px-6 py-3 bg-black text-white font-semibold rounded-xl shadow hover:bg-gray-800"
        >
          Start Recording
        </button>
      )}
    </div>
  );
}
