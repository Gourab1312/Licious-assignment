import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
) {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key)
    if (!storedValue) {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue
    }

    try {
      return JSON.parse(storedValue) as T
    } catch {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as const
}
