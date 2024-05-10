import type React from "react"

interface NoContentProps {
  children: React.ReactNode
}

function NoContent({ children }: NoContentProps) {
  return (
    <div className='h-[calc(100vh-58px)] md:h-screen mx-4 grid place-content-center items-center'>
      <div className='max-w-[800px]'>{children}</div>
    </div>
  )
}

export default NoContent
