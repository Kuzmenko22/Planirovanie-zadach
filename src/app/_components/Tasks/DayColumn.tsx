'use client'

import { formatDateToYYYYMMDD } from '~/lib/utils'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Task as TaskType } from '~/types/task'
import TaskCard from './TaskCard'

interface DayColumnProps {
  date: Date
  label: string
  tasks: TaskType[]
}

const DayColumn = ({ date, label, tasks }: DayColumnProps) => {
  const dayFormatted = format(date, 'd MMM', { locale: ru })

  return (
    <div className="flex flex-col gap-2 border rounded-lg p-2 bg-white shadow-sm min-w-[160px]">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-xs text-gray-500 mb-2">{dayFormatted}</div>
      {tasks.length === 0 ? (
        <div className="text-gray-400 text-sm italic">Задач нет</div>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  )
}

export default DayColumn
