export default function NoteList({ notes, onSelect, onDelete, search }) {
    return (
      <div className="flex flex-col gap-2">
        {notes
          .filter((n) => n.content.toLowerCase().includes(search.toLowerCase()))
          .map((note) => (
            <div
              key={note.id}
              className="bg-gray-800 p-2 rounded flex justify-between items-center"
            >
              <div
                className="flex-grow cursor-pointer"
                onClick={() => onSelect(note)}
              >
                {note.content.substring(0, 40)}...
              </div>
              <button
                className="text-red-400 hover:text-red-600"
                onClick={() => onDelete(note.id)}
              >
                ❌
              </button>
            </div>
          ))}
      </div>
    );
  }
  