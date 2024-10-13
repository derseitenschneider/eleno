import { Button } from '@/components/ui/button'
import StepperProgress, { type Step } from '@/components/ui/stepper.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartHandshakeIcon,
  User2,
  Users2,
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AddGroup from './steps/AddGroup.component'
import AddStudents from './steps/AddStudents.component'
import ImportantLinks from './steps/ImportantLinks.component'
import Welcome from './steps/Welcome.component'
import { useEffect } from 'react'

export default function OnboardingWizzard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobileDevice()
  const navigate = useNavigate()
  const currentStep = Number(searchParams.get('step')) || 0

  useEffect(() => {
    if (isMobile) navigate('/')
  }, [isMobile, navigate])

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
      label: 'Willkommen',
      component: <Welcome />,
      icon: <HeartHandshakeIcon strokeWidth={1.5} />,
    },
    {
      id: 1,
      label: 'Schüler:innen',
      component: <AddStudents onSuccess={goToNext} />,
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
      label: "Los geht's!",
      component: <ImportantLinks />,
      icon: <CheckIcon strokeWidth={1.5} />,
    },
  ]
  return (
    <div className='mx-auto'>
      <StepperProgress steps={steps} currentStep={currentStep} />
      <div className='p-6 w-[550px] rounded-lg border border-hairline bg-card text-card-foreground shadow-sm'>
        {steps[currentStep]?.component}
      </div>

      <div className='flex items-center justify-between mt-8'>
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
            className='flex gap-2 items-center justify-between'
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
            className='flex gap-2 items-center justify-between'
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
  )
}
