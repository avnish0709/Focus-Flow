'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Pause,
  Play,
  RotateCcw,
  Timer,
  X,
  Coffee,
  BookOpen,
  Settings2,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDraggable } from '@/hooks/use-draggable'

type Mode = 'study' | 'break'

type Preset = {
  id: string
  label: string
  studyMin: number
  breakMin: number
}

const DEFAULT_PRESETS: Preset[] = [
  { id: 'p1', label: '45 / 15', studyMin: 45, breakMin: 15 },
  { id: 'p2', label: '60 / 13', studyMin: 60, breakMin: 13 },
  { id: 'custom', label: 'Custom', studyMin: 25, breakMin: 5 },
]

function format(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function StudyTimer() {
  const { style, containerProps, dragHandleProps } = useDraggable()

  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS)
  const [presetId, setPresetId] = useState<string>(DEFAULT_PRESETS[0].id)
  const [mode, setMode] = useState<Mode>('study')
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0)

  const preset = presets.find((p) => p.id === presetId) ?? presets[0]
  const durationFor = useCallback(
    (m: Mode, p: Preset) => (m === 'study' ? p.studyMin : p.breakMin) * 60,
    [],
  )

  const [secondsLeft, setSecondsLeft] = useState(() => DEFAULT_PRESETS[0].studyMin * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Switch to a new preset: reset to that preset's study time.
  const applyPreset = useCallback(
    (id: string) => {
      const p = presets.find((x) => x.id === id) ?? presets[0]
      setPresetId(id)
      setMode('study')
      setRunning(false)
      setSecondsLeft(p.studyMin * 60)
      // Choosing the custom preset reveals the study/break editor.
      if (id === 'custom') setEditing(true)
    },
    [presets],
  )

  // Update a preset's minute values (used by the custom editor).
  const updatePreset = useCallback(
    (id: string, field: 'studyMin' | 'breakMin', value: number) => {
      const safe = Math.max(1, Math.min(180, Math.round(value || 0)))
      setPresets((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: safe } : p)),
      )
      // If editing the active preset while idle, reflect the change immediately.
      setPresetId((current) => {
        if (current === id && !running) {
          setSecondsLeft((prevSeconds) => {
            if (mode === 'study' && field === 'studyMin') return safe * 60
            if (mode === 'break' && field === 'breakMin') return safe * 60
            return prevSeconds
          })
        }
        return current
      })
    },
    [mode, running],
  )

  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(durationFor(mode, preset))
  }, [durationFor, mode, preset])

  // Countdown tick.
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  // Handle a finished session: switch mode and auto-continue.
  useEffect(() => {
    if (secondsLeft !== 0 || !running) return
    const nextMode: Mode = mode === 'study' ? 'break' : 'study'
    if (mode === 'study') setCompleted((c) => c + 1)
    setMode(nextMode)
    setSecondsLeft(durationFor(nextMode, preset))
  }, [secondsLeft, running, mode, preset, durationFor])

  const total = durationFor(mode, preset)
  const progress = total > 0 ? ((total - secondsLeft) / total) * 100 : 0

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open study timer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90"
      >
        <Timer className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div
      {...containerProps}
      style={style}
      className="fixed bottom-5 right-5 z-50 flex max-h-[85vh] min-h-[20rem] w-72 min-w-[16rem] max-w-md resize flex-col overflow-auto rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
    >
      <div
        {...dragHandleProps}
        className="flex cursor-grab items-center justify-between border-b border-border px-4 py-3 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {mode === 'study' ? (
            <BookOpen className="h-4 w-4 text-primary" />
          ) : (
            <Coffee className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium">
            {mode === 'study' ? 'Study session' : 'Break time'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            aria-label="Customize durations"
            aria-pressed={editing}
            className={cn(
              'rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground',
              editing && 'bg-muted text-foreground',
            )}
          >
            <Settings2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimize study timer"
            className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="flex flex-col items-center gap-3">
          <div
            className="font-mono text-5xl font-semibold tabular-nums tracking-tight"
            aria-live="polite"
          >
            {format(secondsLeft)}
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {completed} session{completed === 1 ? '' : 's'} completed
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={total === 0}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Start
              </>
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={secondsLeft === total && !running}
            aria-label="Reset timer"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Pomodoro preset
          </p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={cn(
                  'rounded-xl border px-2 py-2 text-xs font-medium transition',
                  p.id === presetId
                    ? 'border-primary bg-accent text-accent-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                )}
              >
                {p.id === 'custom' ? p.label : p.label}
                <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                  {p.studyMin}/{p.breakMin} min
                </span>
              </button>
            ))}
          </div>
        </div>

        {editing && (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
            <p className="mb-3 text-xs font-medium text-foreground">
              Customize {preset.label} (minutes)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                Study
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={preset.studyMin}
                  onChange={(e) =>
                    updatePreset(preset.id, 'studyMin', Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                Break
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={preset.breakMin}
                  onChange={(e) =>
                    updatePreset(preset.id, 'breakMin', Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              Edit any preset&apos;s study and break lengths. Changes apply when the
              timer is idle.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
