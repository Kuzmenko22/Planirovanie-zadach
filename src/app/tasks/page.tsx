'use client'

import { useState } from 'react'
import { addMonths, format } from 'date-fns'
import { ru } from 'date-fns/locale'

import MonthCalendar from '~/app/_components/Tasks/MonthCalendar'
import type { Task } from '~/types/task'

export const mockTasks: Task[] = [
  {
    id: '1',
    date: '2025-07-09',
    userId: 'user-1',
    title: 'DNS',
    description: 'Подписание договора на 3 месяца?',
    taskType: 'CONTRACT',
    color: 'GREEN',
    price: 5000,
    durationMonths: 3,
  },
  {
    id: '2',
    date: '2025-07-10',
    userId: 'user-1',
    title: 'Ситилинк',
    description: 'Продление',
    taskType: 'RENEWAL',
    color: 'YELLOW',
    price: 8000,
    durationMonths: 6,
  },
  {
    id: '3',
    date: '2025-07-15',
    userId: 'user-1',
    title: 'е2е4',
    description: 'Подписать продление',
    taskType: 'RENEWAL',
    color: 'YELLOW',
    price: 12000,
    durationMonths: 12,
  },
  {
    id: '4',
    date: '2025-07-11',
    userId: 'user-1',
    title: 'Тинькофф Бизнес',
    description: 'Заключение нового договора',
    taskType: 'CONTRACT',
    color: 'GREEN',
    price: 15000,
    durationMonths: 12,
  },
  {
    id: '5',
    date: '2025-07-11',
    userId: 'user-1',
    title: 'Магнит',
    description: 'Расторжение договора в 16:15',
    taskType: 'CANCEL',
    color: 'RED',
    price: 7000,
    durationMonths: 0,
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
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          ← Пред. месяц
        </button>

        <h2 className="text-2xl font-bold">
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </h2>

        <button
          onClick={handleNextMonth}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          След. месяц →
        </button>
      </div>

      <MonthCalendar currentDate={currentDate} tasks={mockTasks} />
    </div>
  )
}

