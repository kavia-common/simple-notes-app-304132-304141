import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
});

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
