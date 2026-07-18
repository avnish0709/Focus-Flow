'use client'

import { useMemo, useState } from 'react'
import { ClipboardList, ListTodo } from 'lucide-react'
import type {
  FilterPriority,
  FilterStatus,
  Task,
  TaskPriority,
} from '@/lib/types'
import { PRIORITY_ORDER } from '@/lib/types'
import { TaskForm } from '@/components/task-form'
import { TaskItem } from '@/components/task-item'
import { TaskFilters } from '@/components/task-filters'

const INITIAL_TASKS: Task[] = [
  {
    id: 'seed-1',
    title: 'Review the quarterly roadmap',
    notes: 'Focus on Q3 priorities and share feedback with the team.',
    priority: 'high',
    completed: false,
    createdAt: Date.now() - 3000,
  },
  {
    id: 'seed-2',
    title: 'Reply to design review comments',
    priority: 'medium',
    completed: false,
    createdAt: Date.now() - 2000,
  },
  {
    id: 'seed-3',
    title: 'Water the office plants',
    priority: 'low',
    completed: true,
    createdAt: Date.now() - 1000,
  },
]

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<FilterStatus>('all')
  const [priority, setPriority] = useState<FilterPriority>('all')

  function addTask(title: string, taskPriority: TaskPriority, notes: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      notes: notes || undefined,
      priority: taskPriority,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return tasks
      .filter((task) => {
        if (status === 'active' && task.completed) return false
        if (status === 'completed' && !task.completed) return false
        if (priority !== 'all' && task.priority !== priority) return false
        if (normalizedQuery) {
          const haystack = `${task.title} ${task.notes ?? ''}`.toLowerCase()
          if (!haystack.includes(normalizedQuery)) return false
        }
        return true
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        if (a.priority !== b.priority)
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        return b.createdAt - a.createdAt
      })
  }, [tasks, query, status, priority])

  const remaining = tasks.filter((task) => !task.completed).length
  const hasTasks = tasks.length > 0
  const hasResults = filteredTasks.length > 0

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ListTodo className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            {remaining === 0
              ? 'All caught up. Nice work.'
              : `${remaining} task${remaining === 1 ? '' : 's'} remaining`}
          </p>
        </div>
      </header>

      <TaskForm onAdd={addTask} />

      <TaskFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
      />

      {hasResults ? (
        <ul className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {hasTasks ? 'No matching tasks' : 'No tasks yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasTasks
                ? 'Try adjusting your search or filters.'
                : 'Add your first task using the form above.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
