import { useEffect } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { ThemeMode } from '../types/task'

const THEME_STORAGE_KEY = 'licious-task-dashboard-theme'

function getInitialTheme(): ThemeMode {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<ThemeMode>(
    THEME_STORAGE_KEY,
    getInitialTheme,
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
