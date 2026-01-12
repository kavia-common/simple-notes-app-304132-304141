import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Toolbar from "./components/Toolbar";
import { createBlankNote, loadNotes, saveNotes } from "./utils/storage";

function sortNotesPinnedThenByUpdatedAt(notes) {
  // Pinned group first; within each group sort by updatedAt descending.
  return [...notes].sort((a, b) => {
    const ap = Boolean(a.pinned);
    const bp = Boolean(b.pinned);
    if (ap !== bp) return ap ? -1 : 1;

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
  const initialNotes = useMemo(
    () => sortNotesPinnedThenByUpdatedAt(loadNotes()),
    []
  );

  const [notes, setNotes] = useState(() => initialNotes);
  const [selectedId, setSelectedId] = useState(() =>
    initialNotes[0]?.id ? initialNotes[0].id : null
  );
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
    // Search applies within both pinned/unpinned groups while keeping pinned group on top.
    // We filter the already-grouped `notes` array to preserve pinned-first ordering.
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
    // Ensure explicit defaults.
    newNote.updatedAt = new Date().toISOString();
    newNote.pinned = false;

    setNotes((prev) => sortNotesPinnedThenByUpdatedAt([newNote, ...prev]));
    setSelectedId(newNote.id);

    // Focus editor after selection is applied.
    focusEditorNext.current = true;
  };

  // PUBLIC_INTERFACE
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  // PUBLIC_INTERFACE
  const handleTogglePin = (id) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, pinned: !Boolean(n.pinned) } : n
      );
      return sortNotesPinnedThenByUpdatedAt(next);
    });
  };

  // PUBLIC_INTERFACE
  const handleNoteChange = (nextNote) => {
    // Update note and bump updatedAt on each change (autosave-friendly).
    // Preserve `pinned` if it isn't part of the editor payload.
    const updated = {
      ...nextNote,
      pinned:
        typeof nextNote.pinned === "boolean"
          ? nextNote.pinned
          : Boolean(selectedNote?.pinned),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const next = prev.map((n) => (n.id === updated.id ? updated : n));
      return sortNotesPinnedThenByUpdatedAt(next);
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
        canPin={Boolean(selectedNote)}
        isPinned={Boolean(selectedNote?.pinned)}
        onTogglePin={() => selectedNote && handleTogglePin(selectedNote.id)}
      />

      <div className="layout" aria-label="Notes app layout">
        <Sidebar
          notes={filteredNotes}
          selectedId={selectedId}
          query={query}
          onQueryChange={setQuery}
          onSelect={handleSelect}
          onTogglePin={handleTogglePin}
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
