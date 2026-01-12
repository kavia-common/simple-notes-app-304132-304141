import React from "react";
import { formatUpdatedAt } from "../utils/format";

// PUBLIC_INTERFACE
export default function NoteListItem({ note, isSelected, onSelect }) {
  /** Note list row used in the sidebar. */
  const title = note.title?.trim() || "Untitled";
  const preview = note.content?.trim() ? note.content.trim().slice(0, 80) : "No content";

  return (
    <li role="option" aria-selected={isSelected} className="note-list__item">
      <button
        type="button"
        className={`note-row ${isSelected ? "note-row--selected" : ""}`}
        onClick={onSelect}
      >
        <div className="note-row__top">
          <span className="note-row__title">{title}</span>
          <span className="note-row__time">{formatUpdatedAt(note.updatedAt)}</span>
        </div>
        <div className="note-row__preview">{preview}</div>
      </button>
    </li>
  );
}
