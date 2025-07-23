/*'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export type Task = {
  id: string
  date: string
  userId: string
  title: string
  description?: string
  taskType: 'CONTRACT' | 'RENEWAL' | 'CANCEL'
  color: 'NO' | 'GREEN' | 'YELLOW' | 'RED'
  price: number
  durationMonths: number
}

interface EditTaskModalProps {
  task: Task | null
  onClose: () => void
  onSave: (updatedTask: Task) => void
}

const EditTaskModal = ({ task, onClose, onSave }: EditTaskModalProps) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    taskType: 'RENEWAL' as Task['taskType'],
    price: 0,
    durationMonths: 1,
  })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        date: task.date.slice(0, 10),
        taskType: task.taskType,
        price: task.price,
        durationMonths: task.durationMonths,
      })
    }
  }, [task])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    onSave({
      ...task,
      ...form,
      price: Number(form.price),
      durationMonths: Number(form.durationMonths),
      date: form.date,
    })
    onClose()
  }

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Наименование компании</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тип задачи</label>
            <select
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="CONTRACT">Заключение</option>
              <option value="RENEWAL">Продление</option>
              <option value="CANCEL">Расторжение</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Комментарий</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Стоимость услуг (₽)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Срок услуг (в месяцах)</label>
            <input
              type="number"
              name="durationMonths"
              value={form.durationMonths}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              min={1}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTaskModal*/

'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export type Task = {
  id: string
  date: string
  userId: string
  title: string
  description?: string
  taskType: 'CONTRACT' | 'RENEWAL' | 'CANCEL'
  color: 'NO' | 'GREEN' | 'YELLOW' | 'RED'
  price: number
  durationMonths: number
}

interface EditTaskModalProps {
  task: Task | null
  onClose: () => void
  onSave: (updatedTask: Partial<Task>) => void
  defaultDate?: string
}

const EditTaskModal = ({ task, onClose, onSave, defaultDate }: EditTaskModalProps) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: defaultDate ?? '',
    taskType: 'RENEWAL' as Task['taskType'],
    price: 0,
    durationMonths: 1,
  })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        date: task.date.slice(0, 10),
        taskType: task.taskType,
        price: task.price,
        durationMonths: task.durationMonths,
      })
    }
  }, [task])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTask = {
      ...task,
      ...form,
      price: Number(form.price),
      durationMonths: Number(form.durationMonths),
      date: form.date,
    }

    onSave(newTask)
    onClose()
  }

  return (
    <Dialog open={!!task || !!defaultDate} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Редактировать задачу' : 'Добавить задачу'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Наименование компании</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тип задачи</label>
            <select
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="CONTRACT">Заключение</option>
              <option value="RENEWAL">Продление</option>
              <option value="CANCEL">Расторжение</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Комментарий</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Стоимость услуг (₽)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Срок услуг (в месяцах)</label>
            <input
              type="number"
              name="durationMonths"
              value={form.durationMonths}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              min={1}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTaskModal
