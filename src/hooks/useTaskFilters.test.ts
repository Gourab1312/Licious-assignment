import { act, renderHook } from '@testing-library/react'
import { useTaskFilters } from './useTaskFilters'
import type { Task } from '../types/task'

const tasks: Task[] = [
  {
    id: '1',
    title: 'Write PRD',
    description: 'Draft product requirements',
    priority: 'High',
    dueDate: '2026-05-01',
    completed: false,
    createdAt: 1,
  },
  {
    id: '2',
    title: 'QA testing',
    description: 'Validate regression checklist',
    priority: 'Low',
    dueDate: '2026-05-03',
    completed: true,
    createdAt: 2,
  },
]

describe('useTaskFilters', () => {
  it('filters by search, status, and priority', () => {
    const { result } = renderHook(() => useTaskFilters(tasks))

    expect(result.current.filteredTasks).toHaveLength(2)

    act(() => {
      result.current.setSearchTerm('qa')
    })
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(['2'])

    act(() => {
      result.current.setStatusFilter('completed')
    })
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(['2'])

    act(() => {
      result.current.setSearchTerm('')
      result.current.setPriorityFilter('High')
      result.current.setStatusFilter('all')
    })
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(['1'])
  })
})
