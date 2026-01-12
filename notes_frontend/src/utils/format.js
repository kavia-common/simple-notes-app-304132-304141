const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// PUBLIC_INTERFACE
export function formatUpdatedAt(isoString) {
  /** Format ISO date for compact UI display. */
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const mm = MONTHS[d.getMonth()];
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm} ${dd}, ${yyyy} ${hh}:${min}`;
}
