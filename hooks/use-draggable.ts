'use client'

import { useCallback, useRef, useState } from 'react'

type Position = { x: number; y: number }

/**
 * Makes a fixed-position widget draggable by a handle element.
 * Spread `dragHandleProps` on the drag handle (e.g. the header) and
 * `containerProps` + `style` on the outer container.
 */
export function useDraggable() {
  const [pos, setPos] = useState<Position | null>(null)
  const dragging = useRef(false)
  const offset = useRef<Position>({ x: 0, y: 0 })

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore clicks on interactive controls inside the handle.
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) {
      return
    }
    if (e.button !== 0) return

    const container = (e.currentTarget as HTMLElement).closest(
      '[data-draggable]',
    ) as HTMLElement | null
    if (!container) return

    const rect = container.getBoundingClientRect()
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    dragging.current = true

    const move = (ev: PointerEvent) => {
      if (!dragging.current) return
      const maxX = window.innerWidth - rect.width - 8
      const maxY = window.innerHeight - rect.height - 8
      const x = Math.max(8, Math.min(ev.clientX - offset.current.x, maxX))
      const y = Math.max(8, Math.min(ev.clientY - offset.current.y, maxY))
      setPos({ x, y })
    }
    const up = () => {
      dragging.current = false
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [])

  const style: React.CSSProperties | undefined = pos
    ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : undefined

  return {
    style,
    containerProps: { 'data-draggable': true as const },
    dragHandleProps: { onPointerDown, style: { touchAction: 'none' as const } },
  }
}
