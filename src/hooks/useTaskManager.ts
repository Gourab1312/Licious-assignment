import { useState } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { INITIAL_TASK_FORM } from '../types/task'
import type { Task, TaskFormState } from '../types/task'

const TASKS_STORAGE_KEY = 'licious-task-dashboard-tasks'

export function useTaskManager() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>(TASKS_STORAGE_KEY, [])
  const [form, setForm] = useState<TaskFormState>(INITIAL_TASK_FORM)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const resetForm = () => {
    setForm(INITIAL_TASK_FORM)
    setEditingTaskId(null)
  }

  const saveTask = () => {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      return false
    }

    if (editingTaskId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
              }
            : task,
        ),
      )
    } else {
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
    }

    resetForm()
    return true
  }

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    })
  }

  const deleteTask = (taskId: string) => {
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

  const reorderTask = (draggedTaskId: string, targetTaskId: string) => {
    if (draggedTaskId === targetTaskId) {
      return
    }

    setTasks((previous) => {
      const fromIndex = previous.findIndex((task) => task.id === draggedTaskId)
      const toIndex = previous.findIndex((task) => task.id === targetTaskId)

      if (fromIndex === -1 || toIndex === -1) {
        return previous
      }

      const next = [...previous]
      const [movedTask] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, movedTask)
      return next
    })
  }

  return {
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
  }
}
