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
    <div className='flex items-center justify-between w-[550px] max-w-3xl mx-auto my-8 p-4'>
      {steps.map((step, index) => (
        <Fragment key={step.id || index}>
          <StepIcon
            icon={step.icon}
            label={step.label || `Step ${index + 1}`}
            isCompleted={index < currentStep}
            isActive={index === currentStep}
          />
          {index < steps.length - 1 && (
            <div className='flex-1 h-0.5 bg-gray-200 mx-2'>
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
    <div className='flex flex-col items-center'>
      <motion.div
        className={cn(
          'size-8 rounded-full flex items-center justify-center',
          isCompleted ? 'bg-primary' : 'ring-1 ring-hairline',
          isActive && 'ring-1 ring-primary',
        )}
        animate={{
          scale: isActive ? 1.2 : 1,
          transition: { type: 'spring', stiffness: 500, damping: 30 },
        }}
      >
        {isCompleted ? (
          <div className='size-5 text-white'>{icon}</div>
        ) : isActive ? (
          <div className='size-5 text-primary'>{icon}</div>
        ) : (
          <div className='size-5 text-foreground/50'>{icon}</div>
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
