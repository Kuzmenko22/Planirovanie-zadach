// src/types/task.ts

export type Task = {
    id: string
    date: string // или Date, если используешь Date-объекты на клиенте
    userId: string
    title: string
    description?: string
    priority: number
    status: 'COMPLETED' | 'NOTCOMPLETED'
    color: 'NO' | 'GREEN' | 'YELLOW' | 'RED'
  }
  