import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type Step = {
  id: number
  label: string
  component: React.ReactNode
  icon: React.ReactNode
}

export type StepIconProps = {
  icon: React.ReactNode
  label: string
  isCompleted: boolean
  isActive: boolean
}

export type StepperProps = {
  steps: Array<Step>
  currentStep: number
}

const StepperProgress = ({ steps, currentStep = 0 }: StepperProps) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return null
  }

  return (
    <div className='mx-auto flex w-auto max-w-3xl items-center justify-center p-4 sm:my-8 sm:w-[550px] sm:justify-between'>
      {steps.map((step, index) => (
        <Fragment key={step.id || index}>
          <StepIcon
            icon={step.icon}
            label={step.label || `Step ${index + 1}`}
            isCompleted={index < currentStep}
            isActive={index === currentStep}
          />
          {index < steps.length - 1 && (
            <div className='mx-2 hidden h-0.5 flex-1 bg-gray-200 sm:block'>
              <motion.div
                className='h-full bg-primary'
                initial={{ width: '0%' }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}

const StepIcon = ({ icon, label, isCompleted, isActive }: StepIconProps) => {
  return (
    <div
      className={cn('hidden sm:flex flex-col items-center', isActive && 'flex')}
    >
      <motion.div
        className={cn(
          'sm:size-8 size-12 rounded-full flex items-center justify-center',
          isCompleted ? 'bg-primary' : 'ring-1 ring-hairline',
          isActive && 'ring-1 ring-primary',
        )}
        animate={{
          scale: isActive ? 1.2 : 1,
          transition: { type: 'spring', stiffness: 500, damping: 30 },
        }}
      >
        {isCompleted ? (
          <div className='size-7 text-white sm:size-5'>{icon}</div>
        ) : isActive ? (
          <div className='size-7 text-primary sm:size-5'>{icon}</div>
        ) : (
          <div className='size-7 text-foreground/50 sm:size-5'>{icon}</div>
        )}
      </motion.div>
      <span
        className={cn(
          'mt-2 text-sm font-medium',
          isActive ? 'text-primary' : 'text-foreground/50',
        )}
      >
        {label}
      </span>
    </div>
  )
}

export default StepperProgress
