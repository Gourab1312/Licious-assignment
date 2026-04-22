import { act, renderHook } from '@testing-library/react'
import { useTaskManager } from './useTaskManager'

describe('useTaskManager', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '11111111-1111-4111-8111-111111111111',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates, updates status, reorders and deletes tasks', () => {
    const { result } = renderHook(() => useTaskManager())

    act(() => {
      result.current.setForm({
        title: 'First task',
        description: 'Plan sprint items',
        priority: 'High',
        dueDate: '2026-06-01',
      })
    })
    act(() => {
      result.current.saveTask()
    })

    vi.mocked(crypto.randomUUID).mockReturnValueOnce(
      '22222222-2222-4222-8222-222222222222',
    )

    act(() => {
      result.current.setForm({
        title: 'Second task',
        description: 'Write tests',
        priority: 'Medium',
        dueDate: '2026-06-02',
      })
    })
    act(() => {
      result.current.saveTask()
    })

    expect(result.current.tasks.map((task) => task.id)).toEqual([
      '22222222-2222-4222-8222-222222222222',
      '11111111-1111-4111-8111-111111111111',
    ])

    act(() => {
      result.current.toggleTaskStatus('11111111-1111-4111-8111-111111111111')
    })
    expect(
      result.current.tasks.find(
        (task) => task.id === '11111111-1111-4111-8111-111111111111',
      )?.completed,
    ).toBe(true)

    act(() => {
      result.current.reorderTask(
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      )
    })
    expect(result.current.tasks.map((task) => task.id)).toEqual([
      '11111111-1111-4111-8111-111111111111',
      '22222222-2222-4222-8222-222222222222',
    ])

    act(() => {
      result.current.deleteTask('22222222-2222-4222-8222-222222222222')
    })
    expect(result.current.tasks.map((task) => task.id)).toEqual([
      '11111111-1111-4111-8111-111111111111',
    ])
  })
})
