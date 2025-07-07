// src/app/_components/Tasks/TaskCard.tsx
'use client'

import type { Task } from '~/types/task'

interface TaskCardProps {
  task: Task
}

const TaskCard = ({ task }: TaskCardProps) => {
  const getColor = (color: Task['color']) => {
    switch (color) {
      case 'GREEN':
        return 'border-green-500'
      case 'YELLOW':
        return 'border-yellow-500'
      case 'RED':
        return 'border-red-500'
      default:
        return 'border-gray-300'
    }
  }

  return (
    <div
      className={`p-2 rounded border-l-4 shadow-sm bg-gray-50 ${getColor(
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
