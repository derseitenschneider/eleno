interface EmptyProps {
  emptyMessage: string
}

function Empty({ emptyMessage }: EmptyProps) {
  return (
    <div className='h-full w-full grid justify-center mt-[6.5%]'>
      <h3 className='heading-3 text-foreground/60'>{emptyMessage}</h3>
    </div>
  )
}

export default Empty
