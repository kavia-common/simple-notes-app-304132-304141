import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Toolbar from "./components/Toolbar";
import { createBlankNote, loadNotes, saveNotes } from "./utils/storage";

function sortNotesDescendingByUpdatedAt(notes) {
  return [...notes].sort((a, b) => {
    const at = new Date(a.updatedAt).getTime();
    const bt = new Date(b.updatedAt).getTime();
    return bt - at;
  });
}

function matchesQuery(note, q) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  return (
    (note.title || "").toLowerCase().includes(query) ||
    (note.content || "").toLowerCase().includes(query)
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Notes app entrypoint: manages app-level state and persistence. */
  const [notes, setNotes] = useState(() => sortNotesDescendingByUpdatedAt(loadNotes()));
  const [selectedId, setSelectedId] = useState(() => (loadNotes()[0]?.id ? loadNotes()[0].id : null));
  const [query, setQuery] = useState("");
  const focusEditorNext = useRef(false);

  // Keep selection valid if notes change.
  useEffect(() => {
    if (notes.length === 0) {
      setSelectedId(null);
      return;
    }
    const stillExists = selectedId && notes.some((n) => n.id === selectedId);
    if (!stillExists) {
      setSelectedId(notes[0].id);
    }
  }, [notes, selectedId]);

  // Persist (autosave) whenever notes change.
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => matchesQuery(n, query));
  }, [notes, query]);

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedId) || null;
  }, [notes, selectedId]);

  const shouldFocusEditor = focusEditorNext.current;
  useEffect(() => {
    if (focusEditorNext.current) {
      focusEditorNext.current = false;
    }
  }, [selectedId]);

  // PUBLIC_INTERFACE
  const handleNewNote = () => {
    const newNote = createBlankNote();
    newNote.updatedAt = new Date().toISOString();

    setNotes((prev) => sortNotesDescendingByUpdatedAt([newNote, ...prev]));
    setSelectedId(newNote.id);

    // Focus editor after selection is applied.
    focusEditorNext.current = true;
  };

  // PUBLIC_INTERFACE
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  // PUBLIC_INTERFACE
  const handleNoteChange = (nextNote) => {
    // Update note and bump updatedAt on each change (autosave-friendly).
    const updated = {
      ...nextNote,
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const next = prev.map((n) => (n.id === updated.id ? updated : n));
      return sortNotesDescendingByUpdatedAt(next);
    });
  };

  // PUBLIC_INTERFACE
  const handleDeleteSelected = () => {
    if (!selectedNote) return;
    const title = selectedNote.title?.trim() || "Untitled";
    const ok = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) return;

    setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
  };

  return (
    <div className="notes-app">
      <Toolbar
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteSelected}
        canDelete={Boolean(selectedNote)}
      />

      <div className="layout" aria-label="Notes app layout">
        <Sidebar
          notes={filteredNotes}
          selectedId={selectedId}
          query={query}
          onQueryChange={setQuery}
          onSelect={handleSelect}
        />

        <main className="main" aria-label="Editor panel">
          <Editor
            note={selectedNote}
            onChange={handleNoteChange}
            shouldFocus={shouldFocusEditor}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
