export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskStatus = 'active' | 'completed'

export type FilterStatus = 'all' | TaskStatus

export type FilterPriority = 'all' | TaskPriority

export interface Task {
  id: string
  title: string
  notes?: string
  priority: TaskPriority
  completed: boolean
  createdAt: number
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}
