import React from "react";

// PUBLIC_INTERFACE
export default function Toolbar({
  onNewNote,
  onDeleteNote,
  canDelete,
  canPin,
  isPinned,
  onTogglePin,
}) {
  /** App toolbar with primary actions. */
  const pinLabel = isPinned ? "Unpin note" : "Pin note";

  return (
    <div className="toolbar" role="toolbar" aria-label="Notes actions">
      <div className="toolbar__left">
        <div className="app-brand">
          <div className="app-brand__dot" aria-hidden="true" />
          <span className="app-brand__text">Notes</span>
        </div>
      </div>

      <div className="toolbar__right">
        <button className="btn btn--primary" type="button" onClick={onNewNote}>
          New Note
        </button>

        <button
          className={`btn btn--ghost ${isPinned ? "btn--ghostActive" : ""}`}
          type="button"
          onClick={onTogglePin}
          disabled={!canPin}
          aria-label={pinLabel}
          title={pinLabel}
        >
          <span aria-hidden="true" style={{ marginRight: 8 }}>
            {isPinned ? "★" : "☆"}
          </span>
          {isPinned ? "Unpin" : "Pin"}
        </button>

        <button
          className="btn btn--danger"
          type="button"
          onClick={onDeleteNote}
          disabled={!canDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
