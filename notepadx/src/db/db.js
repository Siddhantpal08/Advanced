import { core } from '@tauri-apps/api';

export async function getNotes() {
  return await core.invoke("plugin:sql|select", {
    db: "sqlite:notes.db",
    query: "SELECT * FROM notes ORDER BY created_at DESC",
  });
}

export async function addNote(title, content) {
  return await core.invoke("plugin:sql|execute", {
    db: "sqlite:notes.db",
    query: "INSERT INTO notes (title, content) VALUES (?, ?)",
    values: [title, content],
  });
}

export async function deleteNote(title, content) {
  return await core.invoke("plugin:sql|execute", {
    db: "sqlite:notes.db",
    query: "DELETE FROM notes WHERE title = ? AND content = ?",
    values: [title, content],
  });
}
