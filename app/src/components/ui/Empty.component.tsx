import { cn } from '@/lib/utils'

interface EmptyProps {
  emptyMessage: string
  children?: React.ReactNode
  className?: string
}

function Empty({ emptyMessage, children, className }: EmptyProps) {
  return (
    <div
      className={cn(
        className,
        'max-h-full border border-hairline flex flex-col items-center py-12 rounded-md',
      )}
    >
      <h3 className='mb-0 text-center text-lg text-foreground/50'>
        {emptyMessage}
      </h3>
      <div className='h-[120px] text-center'>
        <svg
          width='300'
          height='300'
          viewBox='0 0 300 300'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='opacity-50'
        >
          <title id='svgTitle'>Lupe über einem Blatt Papier</title>
          <path
            d='M70 40H180L210 70V260H70V40Z'
            className='stroke-foreground/40'
            strokeWidth='6'
            strokeLinejoin='round'
          />
          <path
            d='M180 40L210 70H180V40Z'
            className='stroke-foreground/40'
            strokeWidth='6'
            strokeLinejoin='round'
          />
          <path
            d='M95 90H145'
            stroke='#4794AE'
            strokeOpacity='0.42'
            strokeWidth='6'
            strokeLinecap='round'
          />
          <path
            d='M95 120H130'
            stroke='#4794AE'
            strokeOpacity='0.42'
            strokeWidth='6'
            strokeLinecap='round'
          />
          <path
            d='M95 150H145'
            stroke='#4794AE'
            strokeOpacity='0.42'
            strokeWidth='6'
            strokeLinecap='round'
          />
          <path
            d='M140 200C162.091 200 180 182.091 180 160C180 137.909 162.091 120 140 120C117.909 120 100 137.909 100 160C100 182.091 117.909 200 140 200Z'
            // fill='#E6F0F9'
            stroke='#4794AE'
            strokeWidth='8'
          />
          <path
            d='M140 192C157.673 192 172 177.673 172 160C172 142.327 157.673 128 140 128C122.327 128 108 142.327 108 160C108 177.673 122.327 192 140 192Z'
            stroke='#4794AE'
            strokeWidth='3'
          />
          <path
            d='M125 150C130 145 135 145 140 150'
            stroke='#4794AE'
            strokeOpacity='0.06'
            strokeWidth='4'
            strokeLinecap='round'
          />
          <path
            d='M189.498 198.184L172.527 181.213C169.403 178.089 164.337 178.089 161.213 181.213C158.089 184.337 158.089 189.403 161.213 192.527L178.184 209.498C181.308 212.622 186.373 212.622 189.498 209.498C192.622 206.373 192.622 201.308 189.498 198.184Z'
            fill='#4794AE'
            fillOpacity='0.42'
            stroke='#4794AE'
            strokeWidth='3'
          />
        </svg>
      </div>
      {children}
    </div>
  )
}

export default Empty
