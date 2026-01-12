import React from "react";

// PUBLIC_INTERFACE
export default function Toolbar({
  onNewNote,
  onDeleteNote,
  canDelete,
}) {
  /** App toolbar with primary actions. */
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
