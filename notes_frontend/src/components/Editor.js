import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
export default function Editor({
  note,
  onChange,
  shouldFocus,
}) {
  /** Editor for the selected note. */
  const titleRef = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      // Focus title for quick entry; on mobile this opens keyboard as expected.
      titleRef.current?.focus();
    }
  }, [shouldFocus, note?.id]);

  if (!note) {
    return (
      <div className="editor editor--empty" role="status">
        <h2 className="editor__emptyTitle">Select a note</h2>
        <p className="editor__emptyText">
          Choose a note from the list, or create a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="editor" aria-label="Note editor">
      <div className="editor__field">
        <label className="editor__label" htmlFor="note-title">
          Title
        </label>
        <input
          id="note-title"
          ref={titleRef}
          className="editor__input"
          type="text"
          value={note.title}
          placeholder="Untitled"
          onChange={(e) => onChange({ ...note, title: e.target.value })}
        />
      </div>

      <div className="editor__field editor__field--grow">
        <label className="editor__label" htmlFor="note-content">
          Content
        </label>
        <textarea
          id="note-content"
          className="editor__textarea"
          value={note.content}
          placeholder="Write your note…"
          onChange={(e) => onChange({ ...note, content: e.target.value })}
        />
      </div>
    </div>
  );
}
