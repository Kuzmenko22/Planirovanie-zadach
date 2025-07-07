// src/app/_components/Tasks/WeekCalendar.tsx
'use client'

import { getWeekDates } from '~/lib/utils'
import type { Task } from '~/types/task'
import DayColumn from './DayColumn'
import { formatDateToYYYYMMDD } from '~/lib/utils'

interface WeekCalendarProps {
  currentDate: Date
  tasks: Task[]
}

const WeekCalendar = ({ currentDate, tasks }: WeekCalendarProps) => {
  const weekDates = getWeekDates(currentDate)

  return (
    <div className="flex gap-4 overflow-x-auto p-2">
      {weekDates.map(({ date, label }) => {
        const formatted = formatDateToYYYYMMDD(date)

        const dayTasks = tasks.filter(
          (task) => formatDateToYYYYMMDD(task.date) === formatted,
        )

        return (
          <DayColumn key={formatted} date={date} label={label} tasks={dayTasks} />
        )
      })}
    </div>
  )
}

export default WeekCalendar
