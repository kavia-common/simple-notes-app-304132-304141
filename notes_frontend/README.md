# Notes Frontend (React)

A lightweight, fully client-side Notes app built with React (no backend required).

## Features

- Two-pane responsive layout:
  - Left sidebar: searchable list of notes (title + preview + updated time)
  - Right panel: view/edit the selected note
- Create note (New Note)
  - Creates a blank note and focuses the title field
- Edit note (title + content)
  - Autosaves on change (updates `updatedAt`)
- Delete note
  - Confirmation dialog before deleting
- Local persistence using `localStorage`
  - Notes are restored on refresh/navigation

## LocalStorage format

Notes are stored under the key:

- `simple_notes_app__notes_v1`

Value is a JSON array of objects:

```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "updatedAt": "ISO-8601 string"
  }
]
```

## Development

In the project directory:

- `npm start` – run locally (port 3000)
- `npm test` – run tests
- `npm run build` – production build
