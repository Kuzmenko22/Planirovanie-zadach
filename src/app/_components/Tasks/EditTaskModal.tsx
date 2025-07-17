'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import type { Task } from '~/types/task'

interface EditTaskModalProps {
  task: Task | null
  onClose: () => void
  onSave: (updatedTask: Task) => void
}

const EditTaskModal = ({ task, onClose, onSave }: EditTaskModalProps) => {
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    date: task?.date ?? '',
    color: task?.color ?? 'NO',
    type: task?.type ?? 'ПРОДЛЕНИЕ',
    amount: task?.amount ?? 0,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return
    onSave({ ...task, ...form, amount: Number(form.amount) })
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
            <label className="block text-sm font-medium mb-1">Наименование</label>
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
            <label className="block text-sm font-medium mb-1">Цвет</label>
            <select
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="NO">Нет</option>
              <option value="GREEN">Зелёный</option>
              <option value="YELLOW">Жёлтый</option>
              <option value="RED">Красный</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тип задачи</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="ПРОДЛЕНИЕ">Продление</option>
              <option value="РАСТОРЖЕНИЕ">Расторжение</option>
              <option value="ЗАКЛЮЧЕНИЕ">Заключение</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Сумма (₽)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
