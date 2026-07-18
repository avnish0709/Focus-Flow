'use client'

import { useMemo } from 'react'

type Drop = {
  left: number
  delay: number
  duration: number
  opacity: number
  height: number
}

export function NatureBackground() {
  const drops = useMemo<Drop[]>(() => {
    return Array.from({ length: 90 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 0.5 + Math.random() * 0.8,
      opacity: 0.25 + Math.random() * 0.5,
      height: 50 + Math.random() * 70,
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/nature-rain.png)' }}
      />
      {/* Cool tint + readability overlay */}
      <div className="absolute inset-0 bg-slate-900/25" />
      {/* Animated rain */}
      <div className="absolute inset-0">
        {drops.map((drop, i) => (
          <span
            key={i}
            className="rain-drop"
            style={{
              left: `${drop.left}%`,
              height: `${drop.height}px`,
              opacity: drop.opacity,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
