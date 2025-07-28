import { Button } from '@/components/ui/button'
import StepperProgress, { type Step } from '@/components/ui/stepper.component'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RocketIcon,
  User2,
  Users2,
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AddGroup from './steps/AddGroup.component'
import AddStudents from './steps/AddStudents.component'
import ImportantLinks from './steps/ImportantLinks.component'
import Welcome from './steps/Welcome.component'

export default function FirstStepsWizzard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentStep = Number(searchParams.get('step')) || 0

  function goBack() {
    searchParams.set('step', String(currentStep - 1))
    setSearchParams(searchParams)
  }
  function goToNext() {
    if (currentStep !== steps.length - 1) {
      searchParams.set('step', String(currentStep + 1))
      setSearchParams(searchParams)
    }
  }
  const steps: Array<Step> = [
    {
      id: 0,
      label: "Los geht's!",
      component: <Welcome />,
      icon: <RocketIcon strokeWidth={1.5} />,
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
      component: <AddGroup onSuccess={goToNext} />,
      icon: <Users2 strokeWidth={1.5} />,
    },
    {
      id: 3,
      label: 'Fertig!',
      component: <ImportantLinks />,
      icon: <CheckIcon strokeWidth={1.5} />,
    },
  ]
  return (
    <div className='mx-auto flex flex-col'>
      <StepperProgress steps={steps} currentStep={currentStep} />
      <div className='flex flex-1 flex-col justify-center'>
        <div className='rounded-lg border border-hairline bg-card p-6 text-card-foreground shadow-sm sm:w-[550px]'>
          {steps[currentStep]?.component}
        </div>

        <div className='mt-8 flex items-center justify-between'>
          {currentStep === 0 ? (
            <Button
              onClick={() => navigate('/')}
              variant='outline'
              type='button'
              size='sm'
            >
              Überspringen
            </Button>
          ) : (
            <Button
              className='flex items-center justify-between gap-1'
              variant='outline'
              type='button'
              size='sm'
              onClick={goBack}
            >
              <ChevronLeftIcon className='size-4' />
              Zurück
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              type='button'
              size='sm'
              className='flex items-center justify-between gap-1'
              onClick={goToNext}
            >
              Weiter
              <ChevronRightIcon className='size-4' />
            </Button>
          ) : (
            <Button
              type='button'
              size='sm'
              onClick={() => {
                navigate('/')
              }}
            >
              Abschliessen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
