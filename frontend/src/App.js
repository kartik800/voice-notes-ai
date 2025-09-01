import { useEffect, useState } from "react";
import Recorder from "./components/Recorder";
import NoteList from "./components/NoteList";
import api from "./api";

function App() {
  const [notes, setNotes] = useState([]);

  async function fetchNotes() {
    const { data } = await api.get("/notes");
    setNotes(data);
  }

  async function pollTranscript(noteId) {
    const interval = setInterval(async () => {
      const { data } = await api.get(`/notes/${noteId}`);
      if (data.transcript && data.transcript.trim() !== "") {
        setNotes((prev) => prev.map((n) => (n._id === noteId ? data : n)));
        clearInterval(interval);
      }
    }, 3000); // every 3s
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function handleUploaded(note) {
    setNotes((prev) => [note, ...prev]);
    pollTranscript(note._id);
  }

  function handleUpdate(updated) {
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  }

  function handleDelete(id) {
    setNotes((prev) => prev.filter((n) => n._id !== id));
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="flex justify-center text-center font-bold text-4xl">
        {" "}
        Voice Notes
      </h1>
      <Recorder onUploaded={handleUploaded} />
      <NoteList notes={notes} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}

export default App;
