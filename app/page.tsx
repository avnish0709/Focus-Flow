import { TaskManager } from '@/components/task-manager'
import { StudyTimer } from '@/components/study-timer'
import { NatureBackground } from '@/components/nature-background'
import { MusicPlayer } from '@/components/music-player'

export default function Page() {
  return (
    <>
      <NatureBackground />
      <MusicPlayer />
      <main className="relative z-10 flex min-h-screen items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-2xl rounded-2xl border border-white/40 bg-background/85 p-5 shadow-2xl backdrop-blur-md sm:p-7">
          <TaskManager />
        </div>
      </main>
      <StudyTimer />
    </>
  )
}
