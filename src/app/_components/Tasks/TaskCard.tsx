'use client'

import type { Task } from '~/types/task'

export const getColorClass = (color: Task['color']) => {
  switch (color) {
    case 'GREEN':
      return 'bg-green-100 text-green-900 border-green-300'
    case 'YELLOW':
      return 'bg-yellow-100 text-yellow-900 border-yellow-300'
    case 'RED':
      return 'bg-red-100 text-red-900 border-red-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

interface TaskCardProps {
  task: Task
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div
      className={`p-2 rounded border-l-4 shadow-sm ${getColorClass(
        task.color,
      )}`}
    >
      <div className="text-sm font-semibold">{task.title}</div>
      {task.description && (
        <div className="text-xs text-gray-600">{task.description}</div>
      )}
    </div>
  )
}

export default TaskCard
