import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
});

function getAllNotesListItems() {
  const list = screen.getByRole("listbox", { name: /all notes/i });
  return within(list).getAllByRole("option");
}

test("renders notes layout (search + editor empty state)", () => {
  render(<App />);
  expect(screen.getByLabelText(/notes list/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/notes actions/i)).toBeInTheDocument();
  expect(screen.getByText(/select a note/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
});

test("creating a new note updates list and enables delete", () => {
  render(<App />);

  const newBtn = screen.getByRole("button", { name: /new note/i });
  fireEvent.click(newBtn);

  // Sidebar should now show the default "Untitled" note.
  expect(screen.getByText("Untitled")).toBeInTheDocument();

  const deleteBtn = screen.getByRole("button", { name: /delete/i });
  expect(deleteBtn).not.toBeDisabled();
});

test("pinning moves note to pinned group at top; unpin returns to unpinned ordering", () => {
  render(<App />);

  const newBtn = screen.getByRole("button", { name: /new note/i });

  // Create first note, rename to "First"
  fireEvent.click(newBtn);
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "First" },
  });

  // Create second note, rename to "Second" (this will be most recently updated)
  fireEvent.click(newBtn);
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "Second" },
  });

  // Initially, "Second" should be top due to updatedAt sort.
  let items = getAllNotesListItems();
  expect(within(items[0]).getByText("Second")).toBeInTheDocument();
  expect(within(items[1]).getByText("First")).toBeInTheDocument();

  // Pin "First" from its row button; it should jump to top (pinned group).
  const firstRow = items[1];
  const pinFirstBtn = within(firstRow).getByRole("button", {
    name: /pin note/i,
  });
  fireEvent.click(pinFirstBtn);

  items = getAllNotesListItems();
  expect(within(items[0]).getByText("First")).toBeInTheDocument();
  expect(within(items[1]).getByText("Second")).toBeInTheDocument();

  // Unpin "First"; should go back under "Second" (unpinned ordering by updatedAt).
  const firstRowNowTop = items[0];
  const unpinFirstBtn = within(firstRowNowTop).getByRole("button", {
    name: /unpin note/i,
  });
  fireEvent.click(unpinFirstBtn);

  items = getAllNotesListItems();
  expect(within(items[0]).getByText("Second")).toBeInTheDocument();
  expect(within(items[1]).getByText("First")).toBeInTheDocument();
});

test("pin state persists after reload (remount)", () => {
  const { unmount } = render(<App />);

  const newBtn = screen.getByRole("button", { name: /new note/i });
  fireEvent.click(newBtn);
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "Persisted" },
  });

  // Pin using toolbar button (active note is selected).
  const pinToolbarBtn = screen.getByRole("button", { name: /pin note/i });
  fireEvent.click(pinToolbarBtn);

  // Remount App (simulates reload)
  unmount();
  render(<App />);

  const items = getAllNotesListItems();
  expect(within(items[0]).getByText("Persisted")).toBeInTheDocument();
  // Confirm the pinned affordance exists after reload.
  expect(
    within(items[0]).getByRole("button", { name: /unpin note/i })
  ).toBeInTheDocument();
});
