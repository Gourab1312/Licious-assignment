import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Priority = 'Low' | 'Medium' | 'High'
type StatusFilter = 'all' | 'pending' | 'completed'
type ViewMode = 'list' | 'card'
type ThemeMode = 'light' | 'dark'

type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: number
}

type TaskFormState = {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

const TASKS_STORAGE_KEY = 'licious-task-dashboard-tasks'
const THEME_STORAGE_KEY = 'licious-task-dashboard-theme'

const initialForm: TaskFormState = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
}

const priorityWeight: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 }

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!storedTasks) {
      return []
    }
    try {
      const parsed = JSON.parse(storedTasks) as Task[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [form, setForm] = useState<TaskFormState>(initialForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return tasks
      .filter((task) => {
        const matchesQuery =
          !query ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'completed' ? task.completed : !task.completed)
        const matchesPriority =
          priorityFilter === 'all' || task.priority === priorityFilter

        return matchesQuery && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed)
        }
        if (a.dueDate !== b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate)
        }
        if (a.priority !== b.priority) {
          return priorityWeight[b.priority] - priorityWeight[a.priority]
        }
        return b.createdAt - a.createdAt
      })
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  const resetForm = () => {
    setForm(initialForm)
    setEditingTaskId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      return
    }

    if (editingTaskId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTaskId ? { ...task, ...form, title: form.title.trim(), description: form.description.trim() } : task,
        ),
      )
      resetForm()
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
      completed: false,
      createdAt: Date.now(),
    }

    setTasks((previous) => [newTask, ...previous])
    resetForm()
  }

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    })
  }

  const handleDelete = (taskId: string) => {
    // Native confirm keeps the UX simple and satisfies the assignment requirement.
    const shouldDelete = window.confirm('Delete this task permanently?')
    if (!shouldDelete) {
      return
    }
    setTasks((previous) => previous.filter((task) => task.id !== taskId))
    if (editingTaskId === taskId) {
      resetForm()
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Task Management Dashboard</h1>
          <p>Create, track, and complete your daily work in one place.</p>
        </div>
        <button
          className="ghost-button"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          type="button"
        >
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </header>

      <section className="panel">
        <h2>{editingTaskId ? 'Edit Task' : 'Create Task'}</h2>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            value={form.title}
            onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
            placeholder="Task title"
            maxLength={80}
            required
          />
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, description: event.target.value }))
            }
            placeholder="Task description"
            rows={3}
            maxLength={240}
            required
          />
          <div className="form-row">
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, priority: event.target.value as Priority }))
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((previous) => ({ ...previous, dueDate: event.target.value }))}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">{editingTaskId ? 'Update task' : 'Add task'}</button>
            {editingTaskId && (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title or description"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="all">All tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as 'all' | Priority)}
          >
            <option value="all">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setViewMode((current) => (current === 'list' ? 'card' : 'list'))}
          >
            {viewMode === 'list' ? 'Card view' : 'List view'}
          </button>
        </div>

        <div className="stats">
          <span>Total: {totalTasks}</span>
          <span>Pending: {pendingTasks}</span>
          <span>Completed: {completedTasks}</span>
        </div>

        <div className={viewMode === 'list' ? 'task-list' : 'task-grid'}>
          {filteredTasks.length === 0 ? (
            <p className="empty-state">No tasks match your current filters.</p>
          ) : (
            filteredTasks.map((task) => (
              <article
                key={task.id}
                className={`task-item ${task.completed ? 'task-completed' : ''}`}
              >
                <div className="task-main">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span>Due: {task.dueDate}</span>
                    <span>{task.completed ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button type="button" onClick={() => toggleTaskStatus(task.id)}>
                    {task.completed ? 'Mark pending' : 'Mark complete'}
                  </button>
                  <button type="button" className="ghost-button" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  <button type="button" className="danger-button" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default App
