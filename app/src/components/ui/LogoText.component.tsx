import Logo from './Logo.component'

export default function LogoText({ className }: { className: string }) {
  return (
    <div className={className}>
      <a
        href='https://eleno.net'
        target='_blank'
        className='flex items-center justify-start gap-1 hover:no-underline '
        rel='noreferrer'
      >
        <div className='aspect-auto h-[32px]'>
          <Logo />
        </div>
        <p className=' text-xl font-medium tracking-tight text-primary'>
          eleno
        </p>
      </a>
    </div>
  )
}
