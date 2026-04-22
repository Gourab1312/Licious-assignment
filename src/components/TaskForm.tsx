import type { FormEvent } from 'react'
import type { Priority, TaskFormState } from '../types/task'

type TaskFormProps = {
  form: TaskFormState
  isEditing: boolean
  onChange: (next: TaskFormState) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

export function TaskForm({
  form,
  isEditing,
  onChange,
  onSubmit,
  onCancelEdit,
}: TaskFormProps) {
  const minDueDate = new Date().toISOString().split('T')[0]

  return (
    <section className="panel">
      <h2>{isEditing ? 'Edit Task' : 'Create Task'}</h2>
      <form className="task-form" onSubmit={onSubmit}>
        <input
          aria-label="Task title"
          value={form.title}
          onChange={(event) => onChange({ ...form, title: event.target.value })}
          placeholder="Task title"
          maxLength={80}
          required
        />
        <textarea
          aria-label="Task description"
          value={form.description}
          onChange={(event) => onChange({ ...form, description: event.target.value })}
          placeholder="Task description"
          rows={3}
          maxLength={240}
          required
        />
        <div className="form-row">
          <select
            aria-label="Task priority"
            value={form.priority}
            onChange={(event) =>
              onChange({ ...form, priority: event.target.value as Priority })
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            aria-label="Task due date"
            type="date"
            value={form.dueDate}
            onChange={(event) => onChange({ ...form, dueDate: event.target.value })}
            min={minDueDate}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Update task' : 'Add task'}</button>
          {isEditing && (
            <button type="button" className="ghost-button" onClick={onCancelEdit}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
