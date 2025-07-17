'use client'

import { formatDateToYYYYMMDD } from '~/lib/utils'
import { format, isToday } from 'date-fns'
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
  const isCurrentDay = isToday(date)

  return (
    <div
      className={`flex flex-col gap-2 border rounded-lg p-2 min-h-[120px] ${
        isCurrentDay
          ? 'bg-blue-50 border-blue-400 shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <div
        className={`text-sm font-medium ${
          isCurrentDay ? 'text-blue-700' : 'text-gray-600'
        }`}
      >
        {label}
      </div>
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
