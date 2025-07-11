'use client'

import { useState } from 'react'
import { addMonths, format } from 'date-fns'
import { ru } from 'date-fns/locale'

import MonthCalendar from '~/app/_components/Tasks/MonthCalendar'
import type { Task } from '~/types/task'

// Временные задачи для теста
const mockTasks: Task[] = [
  {
    id: '1',
    date: '2025-07-09',
    userId: 'user-1',
    color: 'GREEN',
    status: 'NOTCOMPLETED',
    priority: 1,
    title: 'Сделать отчёт',
    description: 'Подготовить отчёт по проекту',
  },
  {
    id: '2',
    date: '2025-07-10',
    userId: 'user-1',
    color: 'YELLOW',
    status: 'COMPLETED',
    priority: 2,
    title: 'Встреча с командой',
    description: 'Обсудить задачи на неделю',
  },
  {
    id: '3',
    date: '2025-07-15',
    userId: 'user-1',
    color: 'RED',
    status: 'NOTCOMPLETED',
    priority: 3,
    title: 'Срок договора',
    description: 'Подписать продление',
  },
]

export default function TasksPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handlePrevMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Пред. месяц
        </button>

        <h2 className="text-xl font-bold">
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </h2>

        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          След. месяц →
        </button>
      </div>

      <MonthCalendar currentDate={currentDate} tasks={mockTasks} />
    </div>
  )
}
