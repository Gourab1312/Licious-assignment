import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { TaskToolbar } from './components/TaskToolbar'
import { useTaskFilters } from './hooks/useTaskFilters'
import { useTaskManager } from './hooks/useTaskManager'
import { useTheme } from './hooks/useTheme'
import type { Task, ViewMode } from './types/task'

function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    tasks,
    form,
    editingTaskId,
    setForm,
    saveTask,
    startEditing,
    deleteTask,
    toggleTaskStatus,
    reorderTask,
    resetForm,
  } = useTaskManager()
  const {
    searchTerm,
    statusFilter,
    priorityFilter,
    filteredTasks,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
  } = useTaskFilters(tasks)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const formSectionRef = useRef<HTMLDivElement | null>(null)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Hook owns mutation paths so UI stays easy to reason about.
    saveTask()
  }

  const handleReorder = (draggedTaskId: string, targetTaskId: string) => {
    // Reorder only visible tasks to keep drag-and-drop intuitive with filters.
    const visibleIds = new Set(filteredTasks.map((task) => task.id))
    if (!visibleIds.has(draggedTaskId) || !visibleIds.has(targetTaskId)) {
      return
    }
    reorderTask(draggedTaskId, targetTaskId)
  }

  const toggleViewMode = () => {
    setViewMode((current) => (current === 'list' ? 'card' : 'list'))
  }

  const handleEditTask = (task: Task) => {
    startEditing(task)
    formSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <main className="app">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} />

      <div ref={formSectionRef}>
        <TaskForm
          form={form}
          isEditing={Boolean(editingTaskId)}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancelEdit={resetForm}
        />
      </div>

      <section className="panel">
        <TaskToolbar
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          viewMode={viewMode}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onToggleView={toggleViewMode}
        />

        <TaskStats
          total={totalTasks}
          pending={pendingTasks}
          completed={completedTasks}
        />

        <TaskList
          tasks={filteredTasks}
          viewMode={viewMode}
          onToggleStatus={toggleTaskStatus}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onReorder={handleReorder}
        />
      </section>
    </main>
  )
}

export default App
