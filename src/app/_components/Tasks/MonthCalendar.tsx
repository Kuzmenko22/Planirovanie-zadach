'use client'

import { getMonthDates } from '~/lib/utils'
import type { Task } from '~/types/task'
import DayColumn from './DayColumn'
import { isSameDay, parseISO } from 'date-fns'

interface MonthCalendarProps {
  currentDate: Date
  tasks: Task[]
}

const MonthCalendar = ({ currentDate, tasks }: MonthCalendarProps) => {
  const monthDates = getMonthDates(currentDate)

  return (
    <div className="grid grid-cols-7 gap-4">
      {monthDates.map(({ date, label }) => {
        const dayTasks = tasks.filter((task) =>
          isSameDay(parseISO(task.date), date)
        )

        return (
          <DayColumn key={date.toISOString()} date={date} label={label} tasks={dayTasks} />
        )
      })}
    </div>
  )
}

export default MonthCalendar
