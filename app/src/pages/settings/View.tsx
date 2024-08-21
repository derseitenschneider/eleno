import DarkmodeToggle from '../../components/ui/DarkmodeToggle.component'

export default function View() {
  return (
    <div>
      <section className='py-7'>
        <h3>Ansicht</h3>
        <div className='grid grid-cols-[300px_1fr]'>
          <p className='text-foreground/80'>Erscheinungsbild (hell/dunkel)</p>
          <DarkmodeToggle />
        </div>
      </section>
    </div>
  )
}
