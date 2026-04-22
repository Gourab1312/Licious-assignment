import type { ThemeMode } from '../types/task'

type AppHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function AppHeader({ theme, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1>Task Management Dashboard</h1>
        <p>Create, track, and complete your daily work in one place.</p>
      </div>
      <button className="ghost-button" onClick={onToggleTheme} type="button">
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </button>
    </header>
  )
}
