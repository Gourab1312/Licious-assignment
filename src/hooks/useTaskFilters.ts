import { useMemo, useState } from 'react'
import type { Priority, StatusFilter, Task } from '../types/task'

export function useTaskFilters(tasks: Task[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all')

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return tasks.filter((task) => {
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
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  return {
    searchTerm,
    statusFilter,
    priorityFilter,
    filteredTasks,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
  }
}
