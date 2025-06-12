export default function NoteEditor({ note, onChange, onSave }) {
    return (
      <textarea
        className="w-full h-60 p-3 rounded bg-gray-800 text-white border border-gray-700 resize-none"
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your idea..."
      />
    );
  }
  