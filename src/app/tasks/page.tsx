/*'use client'

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
    title: 'DNS',
    description: 'Подписание договора на 3 месяца?',
  },
  {
    id: '2',
    date: '2025-07-10',
    userId: 'user-1',
    color: 'YELLOW',
    status: 'COMPLETED',
    priority: 2,
    title: 'Ситилинк',
    description: 'Продление',
  },
  {
    id: '3',
    date: '2025-07-15',
    userId: 'user-1',
    color: 'YELLOW',
    status: 'NOTCOMPLETED',
    priority: 3,
    title: 'е2е4',
    description: 'Подписать продление',
  },
  {
    id: '4',
    date: '2025-07-11',
    userId: 'user-1',
    color: 'GREEN',
    status: 'NOTCOMPLETED',
    priority: 3,
    title: 'Подписание договора',
    description: 'Заключение нового договора',
  },
  {
    id: '5',
    date: '2025-07-11',
    userId: 'user-1',
    color: 'RED',
    status: 'NOTCOMPLETED',
    priority: 3,
    title: 'Рассторгнуть договор Магнит',
    description: 'Расторжение договора в 16:15',
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
}*/


'use client'

import { useState } from 'react'
import { addMonths, format } from 'date-fns'
import { ru } from 'date-fns/locale'

import MonthCalendar from '~/app/_components/Tasks/MonthCalendar'
import type { Task } from '~/types/task'

// Временные задачи для теста согласно твоей схеме
const mockTasks: Task[] = [
  {
    id: '1',
    date: '2025-07-09',
    userId: 'user-1',
    title: 'DNS',
    description: 'Подписание договора на 3 месяца?',
    amount: 5000,
    type: 'ЗАКЛЮЧЕНИЕ',
    priority: 1,
    status: 'NOTCOMPLETED',
    color: 'GREEN',
  },
  {
    id: '2',
    date: '2025-07-10',
    userId: 'user-1',
    title: 'Ситилинк',
    description: 'Продление',
    amount: 8000,
    type: 'ПРОДЛЕНИЕ',
    priority: 2,
    status: 'COMPLETED',
    color: 'YELLOW',
  },
  {
    id: '3',
    date: '2025-07-15',
    userId: 'user-1',
    title: 'е2е4',
    description: 'Подписать продление',
    amount: 12000,
    type: 'ПРОДЛЕНИЕ',
    priority: 3,
    status: 'NOTCOMPLETED',
    color: 'YELLOW',
  },
  {
    id: '4',
    date: '2025-07-11',
    userId: 'user-1',
    title: 'Подписание договора',
    description: 'Заключение нового договора',
    amount: 15000,
    type: 'ЗАКЛЮЧЕНИЕ',
    priority: 3,
    status: 'NOTCOMPLETED',
    color: 'GREEN',
  },
  {
    id: '5',
    date: '2025-07-11',
    userId: 'user-1',
    title: 'Рассторгнуть договор Магнит',
    description: 'Расторжение договора в 16:15',
    amount: 7000,
    type: 'РАСТОРЖЕНИЕ',
    priority: 3,
    status: 'NOTCOMPLETED',
    color: 'RED',
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

