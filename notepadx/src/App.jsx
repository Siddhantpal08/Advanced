import { useState, useEffect } from "react";
import ToggleTheme from "./components/ToggleTheme";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import { getNotes, addNote, deleteNote } from "./db/db";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [search, setSearch] = useState("");

  async function loadNotes() {
    const data = await getNotes();
    setNotes(data);
  }

  async function handleSaveNote() {
    if (!newNoteText.trim()) return;
    await addNote("Untitled", newNoteText);
    setNewNoteText("");
    loadNotes();
  }

  async function handleDelete(id) {
    await deleteNote(id);
    loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🧠 NotepadX</h1>
        <ToggleTheme />
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white w-full"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSaveNote}
        >
          ➕ New
        </button>
      </div>

      <NoteEditor
        note={newNoteText}
        onChange={setNewNoteText}
        onSave={handleSaveNote}
      />

      <h2 className="mt-6 mb-2 font-semibold">🗂️ All Notes</h2>
      <NoteList
        notes={notes}
        onSelect={(n) => setNewNoteText(n.content)}
        onDelete={handleDelete}
        search={search}
      />
    </div>
  );
}

export default App;
