import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, CircleDot, AlertCircle } from 'lucide-react'

export type Step = {
  id: number
  label: string
  component: React.ReactNode
  icon: React.ReactNode
}

export type StepperProps = {
  steps: Array<Step>
  currentStep: number
}

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const StepperProgress = ({ steps, currentStep = 0 }: StepperProps) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return null
  }

  return (
    <div className='flex items-center justify-between w-[550px] max-w-3xl mx-auto my-8 p-4'>
      {steps.map((step, index) => (
        <React.Fragment key={step.id || index}>
          <Step
            icon={step.icon}
            label={step.label || `Step ${index + 1}`}
            isCompleted={index < currentStep}
            isActive={index === currentStep}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
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
        </React.Fragment>
      ))}
    </div>
  )
}

const Step = ({ icon, label, isCompleted, isActive }) => {
  return (
    <div className='flex flex-col items-center'>
      <motion.div
        className={classNames(
          'size-6 rounded-full flex items-center justify-center',
          isCompleted ? 'bg-primary' : 'bg-background50',
          isActive && 'ring-1 ring-primary',
        )}
        animate={{
          scale: isActive ? 1.2 : 1,
          transition: { type: 'spring', stiffness: 500, damping: 30 },
        }}
      >
        {isCompleted ? (
          <div className='size-4 text-white'>{icon}</div>
        ) : (
          <div className='size-4 text-primary'>{icon}</div>
        )}
      </motion.div>
      <span
        className={classNames(
          'mt-2 text-sm font-medium',
          isActive ? 'text-primary' : 'text-gray-500',
        )}
      >
        {label}
      </span>
    </div>
  )
}

export default StepperProgress
