// src/types/task.ts

export type Task = {
  id: string
  date: string // или Date, если ты используешь объекты Date
  userId: string
  title: string
  description?: string
  amount: number
  type: 'ПРОДЛЕНИЕ' | 'РАСТОРЖЕНИЕ' | 'ЗАКЛЮЧЕНИЕ'
  priority: number
  status: 'COMPLETED' | 'NOTCOMPLETED'
  color: 'NO' | 'GREEN' | 'YELLOW' | 'RED'
}
