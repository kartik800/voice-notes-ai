import NoteCard from "./Notecard";

export default function NoteList({ notes, onUpdate, onDelete }) {
  return (
    <div className="mt-6">
      {notes.length === 0 && (
        <p className="text-gray-500 text-center">
          No notes yet. Record something!
        </p>
      )}
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
