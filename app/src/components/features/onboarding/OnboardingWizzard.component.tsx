import { useState } from 'react'
import Welcome from './steps/Welcome.component'
import StepperProgress, { type Step } from '@/components/ui/stepper.component'
import { Button } from '@/components/ui/button'
import AddStudents from './steps/AddStudents.component'
import AddGroups from './steps/AddGroups.component'
import ImportantLinks from './steps/ImportantLinks.component'
import { CheckIcon, HeartHandshakeIcon, User2, Users2 } from 'lucide-react'

const steps: Array<Step> = [
  {
    id: 0,
    label: 'Willkommen',
    component: <Welcome />,
    icon: <HeartHandshakeIcon strokeWidth={1.5} />,
  },
  {
    id: 1,
    label: 'Schüler:innen',
    component: <AddStudents />,
    icon: <User2 strokeWidth={1.5} />,
  },
  {
    id: 2,
    label: 'Gruppen',
    component: <AddGroups />,
    icon: <Users2 strokeWidth={1.5} />,
  },
  {
    id: 3,
    label: 'Geschafft',
    component: <ImportantLinks />,
    icon: <CheckIcon strokeWidth={1.5} />,
  },
]

export default function OnboardingWizzard() {
  const [currentStep, setCurrentStep] = useState(0)

  function goBack() {
    setCurrentStep((prev) => prev - 1)
  }
  function goToNext() {
    if (currentStep !== steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }
  return (
    <div className='mx-auto'>
      <StepperProgress steps={steps} currentStep={currentStep} />
      <div className='p-6 rounded-lg border border-hairline bg-card w-full sm:w-auto text-card-foreground shadow-sm'>
        {steps[currentStep]?.component}
      </div>

      <div className='flex items-center justify-between mt-8'>
        {currentStep === 0 ? (
          <Button variant='outline' type='button' size='sm'>
            Überspringen
          </Button>
        ) : (
          <Button variant='outline' type='button' size='sm' onClick={goBack}>
            Zurück
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button type='button' size='sm' onClick={goToNext}>
            Weiter
          </Button>
        ) : (
          <Button type='button' size='sm' onClick={() => { }}>
            Abschliessen
          </Button>
        )}
      </div>
    </div>
  )
}
