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