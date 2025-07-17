/*'use client'

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
}

const TasksDialog = ({ open, onOpenChange, date, tasks }: TasksDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Задачи на{' '}
            {date ? format(date, 'd MMMM (EEEE)', { locale: ru }) : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2 rounded border text-sm ${getColorClass(
                task.color,
              )}`}
            >
              <div className="flex justify-between w-full mr-2">
                <span className="font-medium">{task.title}</span>
                <span>{task.priority * 1000} ₽</span>
              </div>
              <Pencil
                size={16}
                className="text-gray-500 hover:text-black cursor-pointer shrink-0"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-1 text-sm text-right pr-1">
          <div className="font-semibold">
            Общая сумма:{' '}
            <span className="font-normal text-gray-600">—</span>
          </div>
          <div className="font-semibold text-red-600">
            Сумма по компаниям на расторжение:{' '}
            <span className="font-normal text-gray-600">—</span>
          </div>
          <div className="font-semibold text-orange-400">
            Сумма по компаниям на продление:{' '}
            <span className="font-normal text-gray-600">—</span>
          </div>
        </div>

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
*/

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Задачи на{' '}
            {date ? format(date, 'd MMMM (EEEE)', { locale: ru }) : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2 rounded border text-sm ${getColorClass(
                task.color,
              )}`}
            >
              <div className="flex justify-between w-full mr-2">
                <span className="font-medium">{task.title}</span>
                <span>{task.priority * 1000} ₽</span>
              </div>
              <Pencil
                size={16}
                className="text-gray-500 hover:text-black cursor-pointer shrink-0"
                onClick={() => onEditTask(task)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-1 text-sm text-right pr-1">
          <div className="font-semibold">
            Общая сумма:{' '}
            <span className="font-normal text-gray-600">—</span>
          </div>
          <div className="font-semibold text-red-600">
            Сумма по компаниям на расторжение:{' '}
            <span className="font-normal text-gray-600">—</span>
          </div>
          <div className="font-semibold text-orange-400">
            Сумма по компаниям на продление:{' '}
            <span className="font-normal text-gray-600">—</span>
          </div>
        </div>

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
