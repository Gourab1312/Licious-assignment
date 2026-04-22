# Task Management Dashboard

A crisp and responsive task dashboard built with React + TypeScript + Vite.

## Features

- Create tasks with `title`, `description`, `priority`, and `due date`
- Edit and delete tasks (with delete confirmation prompt)
- Mark tasks as complete/incomplete with clear visual state
- Search by title/description
- Filter by status (`All`, `Pending`, `Completed`) and priority (`Low`, `Medium`, `High`)
- Task counts for total, pending, and completed
- Persistent storage using `localStorage`
- Responsive UI for desktop/tablet/mobile
- Bonus: list/card view toggle
- Bonus: dark/light theme toggle

## Tech Choices

- **React + TypeScript** for simple, type-safe component logic
- **Local component state** for predictable task operations
- **Memoized filtering/sorting** for efficient UI updates
- **Minimal and readable CSS** with clear design tokens

## Run Locally

```bash
npm install
npm run dev
```

App runs at: [http://localhost:5173](http://localhost:5173)

## Validation

```bash
npm run lint
npm run build
```

Both commands pass successfully.

## Folder Structure

- `src/App.tsx` - dashboard logic and UI
- `src/App.css` - component-level styling
- `src/index.css` - global theme tokens and resets

## Deployment

Deploy easily to Vercel/Netlify/GitHub Pages using the generated `dist` from:

```bash
npm run build
```
