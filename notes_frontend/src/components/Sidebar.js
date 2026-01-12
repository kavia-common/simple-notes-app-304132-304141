import React from "react";
import NoteListItem from "./NoteListItem";

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedId,
  query,
  onQueryChange,
  onSelect,
  onTogglePin,
}) {
  /** Sidebar that renders search input and list of notes. */
  return (
    <aside className="sidebar" aria-label="Notes list">
      <div className="sidebar__header">
        <label className="sidebar__searchLabel" htmlFor="notes-search">
          Search
        </label>
        <input
          id="notes-search"
          className="sidebar__search"
          type="search"
          placeholder="Search notes…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className="sidebar__content">
        {notes.length === 0 ? (
          <div className="empty sidebar__empty" role="status">
            No notes yet.
          </div>
        ) : (
          <ul className="note-list" role="listbox" aria-label="All notes">
            {notes.map((n) => (
              <NoteListItem
                key={n.id}
                note={n}
                isSelected={n.id === selectedId}
                onSelect={() => onSelect(n.id)}
                onTogglePin={() => onTogglePin?.(n.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
