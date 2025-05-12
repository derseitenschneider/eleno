import DarkmodeToggle from '../../ui/DarkmodeToggle.component'

export default function View() {
  return (
    <div>
      <section className='py-7'>
        <h3>Ansicht</h3>
        <div className='grid-cols-[300px_1fr] sm:grid'>
          <p className='mb-4 text-foreground/80 sm:mb-0'>
            Erscheinungsbild (hell/dunkel)
          </p>
          <DarkmodeToggle />
        </div>
      </section>
    </div>
  )
}
