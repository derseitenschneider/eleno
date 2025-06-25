import { CheckIcon } from 'lucide-react'

export function BrandingSection() {
  return (
    <div className='hidden flex-col items-center justify-center bg-slate-100 p-8 sm:flex'>
      <div className='w-full max-w-[36rem] text-[17px] text-zinc-600'>
        <h1 className='!font-semibold tracking-tight text-zinc-600'>
          Dein Unterricht,{' '}
          <span className='bg-gradient-to-r from-primary to-[#6E6ED6] bg-clip-text text-transparent'>
            smart organisiert
          </span>
          .
        </h1>
        <p className='mb-5 font-light text-zinc-600'>
          Entdecke, wie Eleno deinen Alltag als Instrumentallehrperson
          revolutioniert.
        </p>
        <ul className='mb-10 space-y-5'>
          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p className='text-zinc-600'>
              <span className='font-medium text-zinc-600'>Zeit sparen:</span> Eleno hilft dir,
              wertvolle Verwaltungszeit zu sparen.
            </p>
          </li>

          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p className='text-zinc-600'>
              <span className='font-medium text-zinc-600'>Intuitive Dokumentation:</span>{' '}
              Behalte mühelos den Überblick über jede Stunde und den Fortschritt
              deiner Schüler:innen.
            </p>
          </li>

          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p className='text-zinc-600'>
              <span className='font-medium text-zinc-600'>Stressfreie Organisation:</span>{' '}
              Perfekt organisierter Unterricht – ganz ohne Zettelchaos oder
              Excel-Listen.
            </p>
          </li>

          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p className='text-zinc-600'>
              <span className='!font-medium text-zinc-600'>Datenschutz inklusive:</span> Eleno
              ist DSGVO-konform für sichere Schülerdaten.
            </p>
          </li>
        </ul>
        <p className='font-medium text-zinc-600'>
          Bereit für mehr Musik und weniger Papierkram?
        </p>
      </div>
    </div>
  )
}
