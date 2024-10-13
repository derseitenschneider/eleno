import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import CreateStudents from '@/components/features/students/CreateStudents.component'
import { Link, useNavigate } from 'react-router-dom'
import OnboardingWizzard from '@/components/features/onboarding/OnboardingWizzard.component'

// SVG-Symbol-Komponenten mit Barrierefreiheit
const WelcomeSymbol: React.FC = () => (
  <svg
    className='absolute right-0 top-0 h-40 w-40 text-primary/10 transform translate-x-1/3'
    viewBox='0 0 100 100'
    fill='currentColor'
    role='img'
    aria-labelledby='welcomeTitle'
  >
    <title id='welcomeTitle'>Willkommenssymbol: Konzentrische Kreise</title>
    <circle cx='50' cy='50' r='40' />
    <circle cx='50' cy='50' r='30' fill='white' />
    <circle cx='50' cy='50' r='20' />
  </svg>
)

const StudentSymbol: React.FC = () => (
  <svg
    className='absolute left-2/3 bottom-0 h-40 w-40 text-primary/10 translate-y-1/3'
    viewBox='0 0 100 100'
    fill='currentColor'
    role='img'
    aria-labelledby='studentTitle'
  >
    <title id='studentTitle'>Schülersymbol: Verschachtelte Quadrate</title>
    <rect x='20' y='20' width='60' height='60' />
    <rect x='30' y='30' width='40' height='40' fill='white' />
    <rect x='40' y='40' width='20' height='20' />
  </svg>
)

const GroupSymbol: React.FC = () => (
  <svg
    className='absolute right-0 top-0 h-40 w-40 text-primary/10 transform translate-x-1/3 translate-y-1/3'
    viewBox='0 0 100 100'
    fill='currentColor'
    role='img'
    aria-labelledby='groupTitle'
  >
    <title id='groupTitle'>Gruppensymbol: Verschachtelte Dreiecke</title>
    <polygon points='50,15 85,85 15,85' />
    <polygon points='50,30 75,80 25,80' fill='white' />
    <polygon points='50,45 65,75 35,75' />
  </svg>
)

const FinishSymbol: React.FC = () => (
  <svg
    className='absolute right-0 top-0 h-40 w-40 text-purple-100 transform translate-x-1/3 translate-y-1/3'
    viewBox='0 0 100 100'
    fill='currentColor'
    role='img'
    aria-labelledby='finishTitle'
  >
    <title id='finishTitle'>Abschlusssymbol: Verschachtelte Sterne</title>
    <path d='M50 15, 85 85, 15 85, 50 15' />
    <path d='M50 30, 75 80, 25 80, 50 30' fill='white' />
    <path d='M50 45, 65 75, 35 75, 50 45' />
  </svg>
)

// Platzhalter-Komponenten für die Formulare
const StudentForm: React.FC = () => (
  <div className='min-h-[300px]'>Schüler:innen Formular</div>
)
const GroupForm: React.FC = () => (
  <div className='min-h-[300px]'>Gruppen Formular</div>
)

interface OnboardingStepProps {
  title: string
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  previousTitle: string
  nextTitle: string
  onSkip: () => void
  Symbol: React.FC
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  previousTitle,
  nextTitle,
  onSkip,
  Symbol: Deko,
}) => (
  <div className=''>
    {Deko && <Deko />}
    <h2 className='text-2xl font-bold mb-4'>{title}</h2>
    <div className='mb-6 relative z-10'>{children}</div>
    <div className='flex justify-between items-center relative z-10'>
      {currentStep > 1 && (
        <Button size='sm' onClick={onPrevious} variant='outline'>
          ← {previousTitle}
        </Button>
      )}
      <Button
        size='sm'
        onClick={onSkip}
        variant='outline'
        className='text-gray-500'
      >
        Zum Dashboard
      </Button>
      {currentStep < totalSteps ? (
        <Button size='sm' onClick={onNext}>
          {nextTitle} →
        </Button>
      ) : (
        <Button size='sm' onClick={onNext}>
          Abschließen
        </Button>
      )}
    </div>
  </div>
)

interface Step {
  title: string
  content: React.ReactNode
  Symbol?: React.FC
}

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const nextStep = () => setStep(step + 1)
  const previousStep = () => setStep(step - 1)
  const skipToEnd = () => navigate('/')

  useEffect(() => {
    const loader = document.getElementById('loader')
    const body = document.body
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fade-out')
        setTimeout(() => {
          loader.style.display = 'none'
          body.removeAttribute('style')
        }, 1000)
      }, 500)
    }
  }, [])

  const steps: Step[] = [
    {
      title: 'Schüler:innen hinzufügen',
      content: (
        <div className='max-h-[75vh]'>
          <CreateStudents />
        </div>
      ),
      Symbol: StudentSymbol,
    },
    {
      title: 'Gruppen erstellen',
      content: <GroupForm />,
      Symbol: GroupSymbol,
    },
    {
      title: 'Geschafft!',
      content: (
        <div>
          <p className='mb-2'>
            Großartig! Du hast das Onboarding abgeschlossen.
          </p>
          <p className='mb-2'>
            Hier sind einige weitere nützliche Links, um mit Eleno zu starten:
          </p>
          <ul className='list-disc pl-5'>
            <li>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link to='/students'>Schüler:innen verwalten</Link>
            </li>
            <li>
              <Link to='/students/groups'>Gruppen verwalten</Link>
            </li>
            <li>
              <Link to='/todos'>Todos anlegen</Link>
            </li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div className='bg-background100 fixed size-full ml-[-50px] z-[60] grid items-center'>
      <OnboardingWizzard />
      {/* <OnboardingStep */}
      {/*   title={steps[step - 1].title} */}
      {/*   currentStep={step} */}
      {/*   totalSteps={steps.length} */}
      {/*   onNext={step === steps.length ? skipToEnd : nextStep} */}
      {/*   onPrevious={previousStep} */}
      {/*   previousTitle={step > 1 ? steps[step - 2].title : ''} */}
      {/*   nextTitle={step < steps.length ? steps[step].title : ''} */}
      {/*   onSkip={skipToEnd} */}
      {/*   Symbol={steps[step - 1].Symbol} */}
      {/* > */}
      {/*   {steps[step - 1].content} */}
      {/* </OnboardingStep> */}
    </div>
  )
}

export default OnboardingPage
