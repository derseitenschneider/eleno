import DarkmodeToggle from '../../ui/DarkmodeToggle.component'
import { LessonMainLayoutToggle } from './LessonMainLayoutToggle.component'

export default function View() {
  return (
    <div>
      <section className='py-7'>
        <h3>Allgemein</h3>
        <div className='grid-cols-[300px_1fr] sm:grid'>
          <p className='mb-4 text-foreground sm:mb-0'>
            Erscheinungsbild (hell/dunkel)
          </p>
          <DarkmodeToggle />
        </div>
      </section>

      <section className='py-7'>
        <h3>Lektionsblatt</h3>
        <div className='grid-cols-[300px_1fr] sm:grid'>
          <p className='mb-4 text-foreground sm:mb-0'>Layout Hauptansicht</p>
          <LessonMainLayoutToggle />
        </div>
      </section>
    </div>
  )
}
