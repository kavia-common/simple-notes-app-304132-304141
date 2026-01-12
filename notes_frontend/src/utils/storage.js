const STORAGE_KEY = "simple_notes_app__notes_v1";

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} updatedAt ISO string
 */

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes array from localStorage. Returns [] on any parse/shape error. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n) => n && typeof n === "object")
      .map((n) => ({
        id: String(n.id ?? ""),
        title: typeof n.title === "string" ? n.title : "",
        content: typeof n.content === "string" ? n.content : "",
        updatedAt:
          typeof n.updatedAt === "string" ? n.updatedAt : new Date().toISOString(),
      }))
      .filter((n) => n.id.length > 0);
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Persist notes array to localStorage. */
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// PUBLIC_INTERFACE
export function getNotesStorageKey() {
  /** Expose the storage key for documentation/tests. */
  return STORAGE_KEY;
}

// PUBLIC_INTERFACE
export function createBlankNote() {
  /** Create a new blank note with a stable unique id. */
  const now = new Date().toISOString();
  const id =
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return {
    id,
    title: "",
    content: "",
    updatedAt: now,
  };
}
