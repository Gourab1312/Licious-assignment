type TaskStatsProps = {
  total: number
  pending: number
  completed: number
}

export function TaskStats({ total, pending, completed }: TaskStatsProps) {
  return (
    <div className="stats">
      <span>Total: {total}</span>
      <span>Pending: {pending}</span>
      <span>Completed: {completed}</span>
    </div>
  )
}
