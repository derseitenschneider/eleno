import CreateLessonSkeleton from './CreateLessonSkeleton.component'
import HeaderSkeleton from './HeaderSkeleton.component'
import NotesSkeleton from './NotesSkeleton.component'
import PreviousLessonsSkeleton from './PreviousLessonSkeleton.component'

export default function LessonSkeleton() {
  return (
    <div>
      <HeaderSkeleton />
      <div className='md:grid md:grid-cols-[1fr_400px] md:h-[calc(100vh-88px)] overflow-hidden'>
        <main className='md:h-full'>
          <PreviousLessonsSkeleton />
          <CreateLessonSkeleton />
        </main>

        <aside className='border-l h-full border-hairline'>
          <NotesSkeleton />
        </aside>
      </div>
    </div>
  )
}
