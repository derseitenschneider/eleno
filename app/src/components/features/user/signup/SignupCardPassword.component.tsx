import { ButtonGoogle } from '@/components/ui/ButtonGoogle.component'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { cn } from '@/lib/utils'
import { signUpSupabase } from '@/services/api/user.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import WrapperCard from '../login/WrapperCard.component'

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein.' }),
})

type TInput = z.infer<typeof passwordSchema>

export function SignupCardPassword() {
  const [searchParams, setSearchParams] = useSearchParams()
  const fetchErrorToast = useFetchErrorToast()

  const email = searchParams.get('email') || ''

  const form = useForm<TInput>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(passwordSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    try {
      await signUpSupabase({
        email,
        password: data.password,
      })
      searchParams.set('signup', 'success')
      setSearchParams(searchParams)
    } catch {
      fetchErrorToast()
    }
  }

  return (
    <WrapperCard
      complementary={
        <p className='text-center text-sm text-zinc-500 !decoration-zinc-300 sm:w-[40ch]'>
          Durch die Erstellung eines Kontos stimmst du den{' '}
          <Link
            className='text-zinc-500 !decoration-zinc-300'
            target='_blank'
            to='https://eleno.net/terms-conditions'
          >
            Allgemeinen Geschäftsbedingungen
          </Link>{' '}
          und den{' '}
          <Link
            className='text-zinc-500 !decoration-zinc-300'
            target='_blank'
            to='https://eleno.net/impressum-datenschutz'
          >
            Datenschutzrichtlinien
          </Link>{' '}
          zu.
        </p>
      }
      className='sm:mt-[-80px]'
      size='sm'
      header='Eleno starten: Mehr Zeit für Musik.'
    >
      <div className='flex flex-col'>
        <p className='text-sm font-medium text-zinc-600'>E-Mail</p>
        <p className='text-zinc-500'>{email}</p>
      </div>
      <Form {...form}>
        <form
          className='flex flex-col space-y-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-medium text-zinc-700'>
                  Passwort
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    autoFocus
                    spellCheck={false}
                    autoCapitalize='off'
                    autoComplete='current-password'
                    disabled={form.formState.isSubmitting}
                    className={cn(
                      form.formState.errors.password
                        ? 'border-warning'
                        : 'border-zinc-400',
                      'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
                    )}
                    placeholder='Erstelle ein Passwort'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex items-center gap-2'>
            <Button
              disabled={form.formState.isSubmitting}
              className='w-full'
              type='submit'
            >
              Weiter
            </Button>
            {form.formState.isSubmitting && <MiniLoader />}
          </div>
          {form.formState.errors.root && (
            <p className='text-center text-sm text-warning'>
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
      <div className='flex items-center gap-2'>
        <Separator className='shrink' />
        <span className='text-sm text-zinc-500'>ODER</span>
        <Separator className='shrink' />
      </div>
      <ButtonGoogle />
      <div className='flex justify-center'>
        <Link
          className='flex items-center gap-1 text-sm font-normal text-zinc-500 !decoration-zinc-300'
          to='/?page=signup'
        >
          <ChevronLeftIcon size='16' />
          Zurück
        </Link>
      </div>
    </WrapperCard>
  )
}
