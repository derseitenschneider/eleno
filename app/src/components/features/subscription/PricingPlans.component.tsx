import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const PricingPlans = () => {
  const commonFeatures = [
    'Access to all features',
    'Priority support',
    'Regular updates',
    'Cloud storage',
    'Multiple devices',
  ]

  return (
    <div className='flex items-center justify-center min-h-screen bg-background p-4'>
      <div className='flex flex-col sm:flex-row gap-8 max-w-5xl w-full'>
        {/* Monthly Plan */}
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Monthly</CardTitle>
            <div className='mt-4'>
              <span className='text-4xl font-bold'>$9</span>
              <span className='text-muted-foreground'>/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className='space-y-4 mb-8'>
              {commonFeatures.map((feature, index) => (
                <li key={index} className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-green-500' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className='w-full' variant='outline'>
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Yearly Plan - Emphasized */}
        <Card className='flex-1 border-primary shadow-lg relative'>
          <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
            <Badge variant='default' className='bg-primary hover:bg-primary'>
              Recommended
            </Badge>
          </div>
          <CardHeader>
            <CardTitle>Yearly</CardTitle>
            <div className='mt-4'>
              <span className='text-4xl font-bold'>$89</span>
              <span className='text-muted-foreground'>/year</span>
              <div className='text-sm text-green-600 mt-1'>Save 17%</div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className='space-y-4 mb-8'>
              {commonFeatures.map((feature, index) => (
                <li key={index} className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-green-500' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className='w-full'>Get Started</Button>
          </CardContent>
        </Card>

        {/* Lifetime Plan */}
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Lifetime</CardTitle>
            <div className='mt-4'>
              <span className='text-4xl font-bold'>$299</span>
              <span className='text-muted-foreground'>/one-time</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className='space-y-4 mb-8'>
              {commonFeatures.map((feature, index) => (
                <li key={index} className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-green-500' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className='w-full' variant='outline'>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PricingPlans
