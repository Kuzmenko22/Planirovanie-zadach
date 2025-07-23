'use client'

import { getMonthDates } from '~/lib/utils'
import type { Task } from '~/types/task'
import { isSameDay, parseISO, format, getDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'
import TasksDialog from './TasksDialog'
import EditTaskModal from './EditTaskModal'
import { cn } from '~/lib/utils'

interface MonthCalendarProps {
  currentDate: Date
  tasks: Task[]
}

const MonthCalendar = ({ currentDate, tasks }: MonthCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [newTaskDate, setNewTaskDate] = useState<Date | null>(null)

  const monthDates = getMonthDates(currentDate)
  const today = new Date()

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
  }

  const handleCloseEditModal = () => {
    setTaskToEdit(null)
    setNewTaskDate(null)
  }

  const handleSaveTask = (updatedTask: Partial<Task>) => {
    console.log('Сохранено:', updatedTask)
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-2">
        {monthDates.map(({ date, isCurrentMonth }) => {
          const dayTasks = tasks.filter((task) =>
            isSameDay(parseISO(task.date), date)
          )

          const dayOfWeek = getDay(date)
          const weekdayColor =
            dayOfWeek === 0 || dayOfWeek === 6 ? 'text-red-600' : 'text-gray-500'

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'rounded border p-2 min-h-[100px] flex flex-col items-start justify-between text-sm',
                isSameDay(date, today) && 'border-blue-500 bg-blue-50',
                !isCurrentMonth && 'text-gray-500 bg-gray-200 border-gray-300 opacity-45'
              )}
            >
              <div className="flex w-full justify-between items-start">
                <div className="text-black text-base font-semibold min-w-[3ch] truncate max-w-[70%]">
                  {format(date, 'd MMM', { locale: ru })}
                </div>
                <div className={cn('text-sm lowercase font-medium truncate max-w-[25%]', weekdayColor)}>
                  {format(date, 'ccc', { locale: ru })}
                </div>
              </div>

              {dayTasks.length > 0 ? (
                <button
                  onClick={() => setSelectedDate(date)}
                  className="mt-auto px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 max-w-full truncate"
                >
                  Компании
                </button>
              ) : (
                <button
                  onClick={() => setNewTaskDate(date)}
                  className="mt-auto text-xl text-gray-500 hover:text-blue-500"
                  title="Добавить задачу"
                >
                  +
                </button>
              )}
            </div>
          )
        })}
      </div>

      <TasksDialog
        open={!!selectedDate}
        onOpenChange={() => setSelectedDate(null)}
        date={selectedDate}
        tasks={
          selectedDate
            ? tasks.filter((t) => isSameDay(parseISO(t.date), selectedDate))
            : []
        }
        onEditTask={handleEditTask}
        onAddTask={() => {
          if (selectedDate) setNewTaskDate(selectedDate)
        }}
      />

      <EditTaskModal
        task={taskToEdit}
        onClose={handleCloseEditModal}
        onSave={handleSaveTask}
      />

      {newTaskDate && (
        <EditTaskModal
          task={null}
          defaultDate={newTaskDate.toISOString().slice(0, 10)}
          onClose={handleCloseEditModal}
          onSave={handleSaveTask}
        />
      )}
    </>
  )
}

export default MonthCalendar


