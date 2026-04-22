import type { Priority, StatusFilter, ViewMode } from '../types/task'

type TaskToolbarProps = {
  searchTerm: string
  statusFilter: StatusFilter
  priorityFilter: 'all' | Priority
  viewMode: ViewMode
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: StatusFilter) => void
  onPriorityFilterChange: (value: 'all' | Priority) => void
  onToggleView: () => void
}

export function TaskToolbar({
  searchTerm,
  statusFilter,
  priorityFilter,
  viewMode,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onToggleView,
}: TaskToolbarProps) {
  return (
    <div className="toolbar">
      <input
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search title or description"
      />
      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
      >
        <option value="all">All tasks</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={priorityFilter}
        onChange={(event) =>
          onPriorityFilterChange(event.target.value as 'all' | Priority)
        }
      >
        <option value="all">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button className="ghost-button" type="button" onClick={onToggleView}>
        {viewMode === 'list' ? 'Card view' : 'List view'}
      </button>
    </div>
  )
}
