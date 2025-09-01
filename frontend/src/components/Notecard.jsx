import { useState, useEffect } from "react";
import api from "../api";

export default function NoteCard({ note, onUpdate, onDelete }) {
  const [text, setText] = useState(note.transcript);

  const [editing, setEditing] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    setText(note.transcript);
  }, [note.transcript]);
  console.log("text is: ", text);

  async function handleSave() {
    const { data } = await api.put(`/notes/${note._id}`, { transcript: text });
    onUpdate(data);
    setEditing(false);
  }

  async function handleDelete() {
    await api.delete(`/notes/${note._id}`);
    onDelete(note._id);
  }

  async function handleSummarize() {
    try {
      setLoadingSummary(true);
      await api.post(`/notes/${note._id}/summarize`);
      // poll for summary update
      pollSummary(note._id);
    } catch (err) {
      console.error(err);
      setLoadingSummary(false);
    }
  }

  async function pollSummary(noteId) {
    const interval = setInterval(async () => {
      const { data } = await api.get(`/notes/${noteId}`);
      if (data.summary && data.summary.trim() !== "") {
        onUpdate(data); // update in parent state
        clearInterval(interval);
        setLoadingSummary(false);
      }
    }, 3000);
  }

  return (
    <div className="bg-white border rounded-2xl shadow-md p-4 mb-4">
      {editing ? (
        <textarea
          className="w-full p-2 border rounded-lg mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p className="text-gray-800">
          {note.transcript && note.transcript.trim().length > 0
            ? note.transcript
            : "Transcribing..."}
        </p>
      )}

      {note.summary && (
        <p className="mt-2 text-sm text-gray-600">
          <b>Summary:</b> {note.summary}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        {editing ? (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
        >
          Delete
        </button>
        {!note.summary && note.transcript && (
          <button
            onClick={handleSummarize}
            disabled={loadingSummary}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            {loadingSummary ? "Summarizing..." : "Generate Summary"}
          </button>
        )}
      </div>
    </div>
  );
}
