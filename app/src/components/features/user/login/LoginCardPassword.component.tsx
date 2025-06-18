import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import WrapperCard from './WrapperCard.component'
import { Separator } from '@/components/ui/separator'
import { ButtonGoogle } from '@/components/ui/ButtonGoogle.component'
import { PasswordInput } from '@/components/ui/password-input'
import { ChevronLeftIcon } from 'lucide-react'
import supabase from '@/services/api/supabase'

const loginSchema = z.object({
  password: z.string().min(1, { message: 'Passwort fehlt' }),
})

type TInput = z.infer<typeof loginSchema>

export default function LoginCardPassword() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const form = useForm<TInput>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    })
    if (error) {
      form.setError(
        'root',
        { message: 'E-Mail und/oder Passwort ungültig.' },
        { shouldFocus: true },
      )
    }
  }

  return (
    <>
      <WrapperCard
        complementary={
          <p className='text-xs text-zinc-500'>
            <a
              className='text-zinc-500 !decoration-zinc-300'
              href='https://eleno.net/terms-conditions'
              target='_blank'
              rel='noreferrer'
            >
              Allgemeine Geschäftsbedingungen
            </a>{' '}
            und{' '}
            <a
              className='text-zinc-500 !decoration-zinc-300'
              href='https://eleno.net/impressum-datenschutz'
              target='_blank'
              rel='noreferrer'
            >
              Datenschutzrichtlinien
            </a>
          </p>
        }
        size='sm'
        header='Schön, dich wiederzusehen!'
      >
        <div className='flex flex-col'>
          <p className='text-sm font-medium'>E-Mail</p>
          <p>{email}</p>
        </div>
        <Form {...form}>
          <form
            className='flex flex-col space-y-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center justify-between font-semibold text-zinc-700'>
                    Passwort
                    <Link
                      to={`/?page=reset&email=${email}`}
                      className='font-normal text-zinc-500 !decoration-zinc-300'
                    >
                      Passwort vergessen?
                    </Link>
                  </FormLabel>
                  <FormControl
                    onChange={() => {
                      form.clearErrors()
                    }}
                  >
                    <PasswordInput
                      data-testid='login-password'
                      spellCheck={false}
                      autoCapitalize='off'
                      autoComplete='current-password'
                      autoFocus
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        form.formState.errors.password
                          ? 'border-warning'
                          : 'border-zinc-400',
                        'bg-zinc-50 text-zinc-700 placeholder:text-zinc-400',
                      )}
                      placeholder='Dein Passwort'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-2'>
              <Button
                data-testid='login-submit'
                disabled={form.formState.isSubmitting}
                className='w-full'
                type='submit'
              >
                Login
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
          <span className='text-sm'>ODER</span>
          <Separator className='shrink' />
        </div>
        <ButtonGoogle />
        <div className='flex justify-center'>
          <Link
            className='flex items-center gap-1 text-sm font-normal text-zinc-500 !decoration-zinc-300'
            to='/'
          >
            <ChevronLeftIcon size='16' />
            Zurück
          </Link>
        </div>
      </WrapperCard>
    </>
  )
}
