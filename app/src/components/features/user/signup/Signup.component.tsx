import { cn } from '@/lib/utils'
import { BrandingSection } from './BrandingSection.component'
import { SignupEmail } from './SignupEmail.component'

type SignupProps = {
  className: string
}
function Signup({ className }: SignupProps) {
  return (
    <div className={cn(className, 'sm:grid lg:grid-cols-2')}>
      <SignupEmail />
      <BrandingSection />
    </div>
  )
}

export default Signup
