import { useState } from 'react'
import type { Task, ViewMode } from '../types/task'

type TaskListProps = {
  tasks: Task[]
  viewMode: ViewMode
  onToggleStatus: (taskId: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onReorder: (draggedTaskId: string, targetTaskId: string) => void
}

export function TaskList({
  tasks,
  viewMode,
  onToggleStatus,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks match your current filters.</p>
  }

  return (
    <div className={viewMode === 'list' ? 'task-list' : 'task-grid'}>
      {tasks.map((task) => (
        <article
          key={task.id}
          draggable
          onDragStart={() => setDraggingId(task.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggingId) {
              onReorder(draggingId, task.id)
            }
            setDraggingId(null)
          }}
          onDragEnd={() => setDraggingId(null)}
          className={`task-item ${task.completed ? 'task-completed' : ''} ${
            draggingId === task.id ? 'task-dragging' : ''
          }`}
        >
          <div className="task-main">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-meta">
              <span className={`badge badge-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span>Due: {task.dueDate}</span>
              <span>{task.completed ? 'Completed' : 'Pending'}</span>
            </div>
          </div>
          <div className="task-actions">
            <button type="button" onClick={() => onToggleStatus(task.id)}>
              {task.completed ? 'Mark pending' : 'Mark complete'}
            </button>
            <button type="button" className="ghost-button" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button type="button" className="danger-button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
