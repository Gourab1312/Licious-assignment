export type Priority = 'Low' | 'Medium' | 'High'
export type StatusFilter = 'all' | 'pending' | 'completed'
export type ViewMode = 'list' | 'card'
export type ThemeMode = 'light' | 'dark'

export type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: number
}

export type TaskFormState = {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

export const INITIAL_TASK_FORM: TaskFormState = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
}
