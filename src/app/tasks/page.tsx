'use client'

import { useState } from 'react'
import { startOfWeek, addWeeks, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'

import { getWeekDates } from '~/lib/utils'
import DayColumn from '~/app/_components/Tasks/DayColumn'
import type { Task } from '~/types/task'

// Заглушка задач (дата в формате строки, как из Prisma)
const mockTasks: Task[] = [
  {
    id: '1',
    date: '2025-07-07',
    userId: 'user-1',
    color: 'GREEN',
    status: 'NOTCOMPLETED',
    priority: 1,
    title: 'Сделать отчёт',
    description: 'Подготовить отчёт по проекту',
  },
  {
    id: '2',
    date: '2025-07-09',
    userId: 'user-1',
    color: 'YELLOW',
    status: 'COMPLETED',
    priority: 2,
    title: 'Встреча с командой',
    description: 'Обсудить задачи на неделю',
  },
]

export default function TasksPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const weekDates = getWeekDates(currentDate)

  const handlePrevWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, -1))
  }

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Пред. неделя
        </button>

        <h2 className="text-xl font-bold">
          Неделя {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: ru })} —{' '}
          {format(addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 1), 'd MMM yyyy', {
            locale: ru,
          })}
        </h2>

        <button
          onClick={handleNextWeek}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          След. неделя →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map(({ date, label }) => {
          const tasksForDay = mockTasks.filter(
            (task) => {
              const taskDate = parseISO(task.date)
              return taskDate.toDateString() === date.toDateString()
            }
          )

          return (
            <DayColumn
              key={date.toISOString()}
              date={date}
              label={label}
              tasks={tasksForDay}
            />
          )
        })}
      </div>
    </div>
  )
}
