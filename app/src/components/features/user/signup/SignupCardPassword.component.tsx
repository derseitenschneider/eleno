import { Link, useSearchParams } from 'react-router-dom'
import WrapperCard from '../login/WrapperCard.component'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Separator } from '@/components/ui/separator'
import { ButtonGoogle } from '@/components/ui/ButtonGoogle.component'
import { PasswordInput } from '@/components/ui/password-input'
import { signUpSupabase } from '@/services/api/user.api'
import useFetchErrorToast from '@/hooks/fetchErrorToast'

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
        <p className='w-[40ch] text-center text-sm text-zinc-700 '>
          Durch die Erstellung eines Kontos stimmst du den{' '}
          <Link target='_blank' to='https://eleno.net/terms-conditions'>
            Nutzungsbedingungen
          </Link>{' '}
          und der{' '}
          <Link target='_blank' to='https://eleno.net/impressum-datenschutz'>
            Datenschutzrichtlinien
          </Link>{' '}
          zu.
        </p>
      }
      className='sm:mt-[-80px]'
      size='sm'
      header="Los geht's!"
    >
      <div className='flex flex-col'>
        <p className='text-sm font-medium'>E-Mail</p>
        <p>{email}</p>
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
        <span className='text-sm'>ODER</span>
        <Separator className='shrink' />
      </div>
      <ButtonGoogle />
    </WrapperCard>
  )
}
