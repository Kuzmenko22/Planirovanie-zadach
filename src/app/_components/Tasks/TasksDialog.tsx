'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Task } from '~/types/task'
import { Pencil } from 'lucide-react'
import { getColorClass } from './TaskCard'
import React from 'react'
import { Button } from '../ui/button'

interface TasksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  tasks: Task[]
  onEditTask: (task: Task) => void
}

const TasksDialog = ({
  open,
  onOpenChange,
  date,
  tasks,
  onEditTask,
}: TasksDialogProps) => {
  const totalPrice = tasks.reduce((sum, task) => sum + task.price, 0)
  const totalCancelPrice = tasks
    .filter((task) => task.taskType === 'CANCEL')
    .reduce((sum, task) => sum + task.price, 0)
  const totalRenewalPrice = tasks
    .filter((task) => task.taskType === 'RENEWAL')
    .reduce((sum, task) => sum + task.price, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Задачи на {date ? format(date, 'd MMMM (EEEE)', { locale: ru }) : ''}
          </DialogTitle>
        </DialogHeader>

        {tasks.length > 0 ? (
          <div className="mt-4">
            <div className="grid grid-cols-2 font-semibold text-sm border-b pb-2 mb-2">
              <span>Наименование компании</span>
              <span className="text-right">Стоимость (₽)</span>
            </div>

            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded border text-sm relative ${getColorClass(task.color)}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-600 mt-1">{task.description}</div>
                      )}
                    </div>
                    <div className="text-right font-semibold pr-6">
                      {task.price.toLocaleString()} ₽
                    </div>
                  </div>
                  <Pencil
                    size={16}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
                    onClick={() => onEditTask(task)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-1 text-sm text-right pr-1">
              <div className="font-semibold">
                Общая сумма V:{' '}
                <span className="font-normal text-gray-600">
                  {totalPrice.toLocaleString()} ₽
                </span>
              </div>
              <div className="font-semibold text-red-600">
                Общая сумма V по компаниям на расторжение:{' '}
                <span className="font-normal text-gray-600">
                  {totalCancelPrice.toLocaleString()} ₽
                </span>
              </div>
              <div className="font-semibold text-orange-400">
                Общая сумма V по компаниям на продление:{' '}
                <span className="font-normal text-gray-600">
                  {totalRenewalPrice.toLocaleString()} ₽
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 mt-4">
            На этот день задач нет.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Назад
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TasksDialog
