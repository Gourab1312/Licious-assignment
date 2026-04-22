# Task Management Dashboard

A crisp and responsive task dashboard built with React + TypeScript + Vite.

## Live Link 

https://licious-assignment.vercel.app/

## Screenshot of the Dashboard 
<img width="1470" height="800" alt="Screenshot 2026-04-23 at 1 52 56 AM" src="https://github.com/user-attachments/assets/2ccfa5cc-e409-4ff5-92e8-e78f9a6b2eea" />


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
- Bonus: drag-and-drop task reordering
- Bonus: smooth hover and action micro-interactions

## Tech Choices

- **React + TypeScript** for simple, type-safe component logic
- **Custom hooks** for reusable state logic:
  - `useTaskManager` for create/edit/delete/toggle/reorder task operations
  - `useTaskFilters` for search and filter state + derived list
  - `useTheme` for theme persistence and DOM sync
  - `useLocalStorageState` for generic localStorage-backed state
- **Split UI components** for readability and easy maintenance
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
npm run test
```

All commands pass successfully.

## Test Coverage (React Testing Library + Vitest)

- `src/App.test.tsx`
  - integration flow: create task and mark complete
- `src/hooks/useTaskManager.test.ts`
  - create, toggle status, reorder, and delete task behavior
- `src/hooks/useTaskFilters.test.ts`
  - search and filter logic by status/priority

## Folder Structure

- `src/App.tsx` - feature composition and orchestration
- `src/components/` - presentational dashboard components
- `src/hooks/` - reusable custom hooks
- `src/types/task.ts` - shared task and UI types
- `src/App.css` - component-level styling
- `src/index.css` - global theme tokens and resets
