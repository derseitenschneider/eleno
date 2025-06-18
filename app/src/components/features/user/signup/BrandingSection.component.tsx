import { CheckIcon } from 'lucide-react'

export function BrandingSection() {
  return (
    <div className='flex flex-col items-center justify-center bg-zinc-50 p-8'>
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

            <p>
              <span className='font-medium'>Zeit sparen:</span> Eleno hilft dir,
              wertvolle Verwaltungszeit zu sparen.
            </p>
          </li>

          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p>
              <span className='font-medium'>Intuitive Dokumentation:</span>{' '}
              Behalte mühelos den Überblick über jede Stunde und den Fortschritt
              deiner Schüler:innen.
            </p>
          </li>

          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p>
              <span className='font-medium'>Stressfreie Organisation:</span>{' '}
              Perfekt organisierter Unterricht – ganz ohne Zettelchaos oder
              Excel-Listen.
            </p>
          </li>

          <li className='flex items-baseline gap-4'>
            <div className='size-[18px] translate-y-[3px] rounded-md bg-primary/20 p-[2px]'>
              <CheckIcon strokeWidth={3} className='text-primary' />
            </div>

            <p>
              <span className='!font-medium'>Datenschutz inklusive:</span> Eleno
              ist DSGVO-konform für sichere Schülerdaten.
            </p>
          </li>
        </ul>
        <p className='font-medium'>
          Bereit für mehr Musik und weniger Papierkram?
        </p>
      </div>
    </div>
  )
}
