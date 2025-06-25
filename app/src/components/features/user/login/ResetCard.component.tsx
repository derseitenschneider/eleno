import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { recoverPasswordSupabase } from '@/services/api/user.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import ResetSuccess from './ResetSuccess.component'
import WrapperCard from './WrapperCard.component'
import { ChevronLeftIcon } from 'lucide-react'

const resetSchema = z.object({
  email: z
    .string({ required_error: 'E-Mail Adresse fehlt.' })
    .min(1, { message: 'E-Mail Adresse fehlt.' })
    .email({ message: 'Keine gültige E-Mail Adresse.' }),
})

type TInput = z.infer<typeof resetSchema>

export default function ResetCard() {
  const [searchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)

  const email = searchParams.get('email') || ''

  const form = useForm<TInput>({
    defaultValues: {
      email,
    },
    resolver: zodResolver(resetSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    try {
      await recoverPasswordSupabase(data.email)
      setSuccess(true)
    } catch {
      form.setFocus('email')
      form.setError('root', {
        message:
          'Passwort zurücksetzten zurzeit nicht möglich. Versuch es später noch einmal.',
      })
    }
  }
  if (success) {
    return <ResetSuccess />
  }

  return (
    <WrapperCard
      className='mt-[-80px]'
      complementary={
        <div className='flex justify-center'>
          <Link
            className='flex items-center gap-1 text-sm font-normal text-zinc-500 !decoration-zinc-300'
            to='/?page=login'
          >
            <ChevronLeftIcon size='16' />
            Zurück
          </Link>
        </div>
      }
      header='Passwort zurücksetzten'
    >
      <Form {...form}>
        <form
          className='flex flex-col space-y-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-zinc-700'>
                  E-Mail
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder='E-Mail Adresse'
                    {...field}
                    className={cn(
                      form.formState.errors.email
                        ? 'border-warning'
                        : 'border-zinc-400',
                      'bg-zinc-50 text-zinc-700 placeholder:text-zinc-400',
                    )}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className='text-zinc-500'>
                  Du erhältst einen Link zum zurücksetzten deines Passworts.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className='flex items-center gap-2'>
            <Button
              // size='sm'
              disabled={form.formState.isSubmitting}
              type='submit'
              className='w-full'
            >
              Passwort zurücksetzten
            </Button>
            {form.formState.isSubmitting && <MiniLoader />}
          </div>
        </form>
      </Form>
    </WrapperCard>
  )
}
