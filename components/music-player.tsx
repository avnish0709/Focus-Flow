'use client'

import { useMemo, useState } from 'react'
import {
  Music,
  CloudRain,
  Headphones,
  ChevronUp,
  GripVertical,
  Link2,
  Play,
} from 'lucide-react'
import { useDraggable } from '@/hooks/use-draggable'

type Station = {
  id: string
  label: string
  youtubeId: string
  icon: typeof Music
}

const STATIONS: Station[] = [
  { id: 'lofi-girl', label: 'Lofi Girl', youtubeId: 'X4VbdwhkE10', icon: Headphones },
  { id: 'lofi-boy', label: 'Lofi Boy', youtubeId: '4xDzrJKXOOY', icon: Music },
  { id: 'rain', label: 'Rain 10hr', youtubeId: 'mPZkdNFkNps', icon: CloudRain },
]

type Parsed = { type: 'playlist' | 'video'; id: string }

/** Extract a playlist or video id from any YouTube URL. */
function parseYouTube(input: string): Parsed | null {
  const raw = input.trim()
  if (!raw) return null
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
    const list = u.searchParams.get('list')
    if (list) return { type: 'playlist', id: list }
    const v = u.searchParams.get('v')
    if (v) return { type: 'video', id: v }
    const parts = u.pathname.split('/').filter(Boolean)
    if (u.hostname.includes('youtu.be') && parts[0]) return { type: 'video', id: parts[0] }
    const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts')
    if (idx >= 0 && parts[idx + 1]) return { type: 'video', id: parts[idx + 1] }
    return null
  } catch {
    // Bare playlist/video id fallback.
    if (/^PL[\w-]+$/.test(raw) || /^[\w-]{11,}$/.test(raw)) {
      return { type: raw.startsWith('PL') ? 'playlist' : 'video', id: raw }
    }
    return null
  }
}

/** Build a continuously-playing embed URL. */
function buildSrc(parsed: Parsed): string {
  if (parsed.type === 'playlist') {
    return `https://www.youtube.com/embed/videoseries?list=${parsed.id}&listType=playlist&autoplay=1&loop=1&rel=0`
  }
  // loop=1 requires the playlist param set to the same video id.
  return `https://www.youtube.com/embed/${parsed.id}?autoplay=1&loop=1&playlist=${parsed.id}&rel=0`
}

export function MusicPlayer() {
  const { style, containerProps, dragHandleProps } = useDraggable()
  const [open, setOpen] = useState(true)
  const [tab, setTab] = useState<string>(STATIONS[0].id)
  const [linkInput, setLinkInput] = useState('')
  const [playlist, setPlaylist] = useState<Parsed | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isLink = tab === 'link'
  const station = STATIONS.find((s) => s.id === tab)

  const { embedSrc, title } = useMemo(() => {
    if (isLink) {
      return {
        embedSrc: playlist ? buildSrc(playlist) : null,
        title: 'Custom playlist',
      }
    }
    if (station) {
      return { embedSrc: buildSrc({ type: 'video', id: station.youtubeId }), title: station.label }
    }
    return { embedSrc: null, title: '' }
  }, [isLink, playlist, station])

  const activeLabel = isLink ? 'Custom link' : station?.label ?? 'Music'
  const ActiveIcon = isLink ? Link2 : station?.icon ?? Music

  const handlePlayLink = () => {
    const parsed = parseYouTube(linkInput)
    if (!parsed) {
      setError('Enter a valid YouTube playlist or video link.')
      setPlaylist(null)
      return
    }
    setError(null)
    setPlaylist(parsed)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-40 flex size-11 items-center justify-center rounded-full bg-slate-900/70 text-white shadow-lg backdrop-blur transition hover:bg-slate-900/90"
        aria-label="Open music player"
      >
        <Music className="size-5" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div
      {...containerProps}
      style={style}
      className="fixed right-4 top-4 z-40 flex h-[22rem] w-80 min-h-[18rem] min-w-[16rem] max-h-[80vh] max-w-xl resize flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70 text-white shadow-xl backdrop-blur-md"
    >
      <div
        {...dragHandleProps}
        className="flex cursor-grab items-center justify-between px-4 pt-3 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="size-4 text-white/50" aria-hidden="true" />
          <ActiveIcon className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium">{activeLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex size-7 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Minimize music player"
        >
          <ChevronUp className="size-4 rotate-180" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1 px-3 pt-3">
        {STATIONS.map((s) => {
          const selected = s.id === tab
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setTab(s.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium transition ${
                selected ? 'bg-white text-slate-900' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
              aria-pressed={selected}
            >
              <s.icon className="size-3.5" aria-hidden="true" />
              {s.label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setTab('link')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium transition ${
            isLink ? 'bg-white text-slate-900' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
          aria-pressed={isLink}
        >
          <Link2 className="size-3.5" aria-hidden="true" />
          Link
        </button>
      </div>

      {isLink && (
        <div className="px-3 pt-3">
          <div className="flex gap-2">
            <input
              type="url"
              inputMode="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handlePlayLink()
              }}
              placeholder="Paste YouTube playlist link"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            />
            <button
              type="button"
              onClick={handlePlayLink}
              disabled={!linkInput.trim()}
              className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="size-3.5" aria-hidden="true" /> Play
            </button>
          </div>
          {error && <p className="mt-1.5 text-[11px] text-red-300">{error}</p>}
        </div>
      )}

      <div className="mt-3 min-h-0 flex-1 px-3 pb-3">
        {embedSrc ? (
          <iframe
            key={embedSrc}
            className="h-full w-full rounded-lg"
            src={embedSrc}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-white/20 px-4 text-center text-[11px] leading-relaxed text-white/50">
            Paste a YouTube playlist or video link above, then press Play to keep it
            playing continuously.
          </div>
        )}
      </div>
    </div>
  )
}
