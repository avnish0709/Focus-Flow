'use client'

import { Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, TaskPriority } from '@/lib/types'
import { PRIORITY_LABELS } from '@/lib/types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-accent text-accent-foreground',
  low: 'bg-muted text-muted-foreground',
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
          task.completed
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input hover:border-primary',
        )}
      >
        {task.completed && <Check className="size-3.5" aria-hidden="true" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'text-sm font-medium text-foreground text-pretty',
              task.completed && 'text-muted-foreground line-through',
            )}
          >
            {task.title}
          </p>
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
              PRIORITY_STYLES[task.priority],
            )}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {task.notes && (
          <p
            className={cn(
              'mt-1 text-sm text-muted-foreground text-pretty',
              task.completed && 'line-through',
            )}
          >
            {task.notes}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </li>
  )
}
