import { z } from 'zod'
import WrapperCard from './WrapperCard.component'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import SignupSuccess from './SignupSuccess.component'
import { signUpSupabase } from '@/services/api/user.api'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { cn } from '@/lib/utils'

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Vorname fehlt.' }),
    lastName: z.string().min(1, { message: 'Nachname fehlt.' }),
    email: z
      .string()
      .min(1, { message: 'E-Mail Adresse fehlt.' })
      .email({ message: 'Ungültige E-Mail Adresse!' }),
    password: z
      .string()
      .min(1, { message: 'Passwort fehlt.' })
      .min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein.' }),
    password2: z.string().min(1, { message: 'Passwort-Wiederholung fehlt.' }),
    terms: z.boolean().refine((val) => val, {
      message:
        'Bitte akzeptiere die Datenschutzbestimmungen und die Allgemeinen Geschäftsbedingungen!',
    }),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Die Passwörter stimmen nicht überein!',
    path: ['password2'],
  })

type TInput = z.infer<typeof signupSchema>

export default function SignupCard() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const form = useForm<TInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
      terms: false,
    },
    resolver: zodResolver(signupSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    try {
      const res = await signUpSupabase(data)
      setIsSuccess(true)
      setEmail(res.user?.email || '')
    } catch (error) {
      form.setFocus('email')
      form.setError('root', {
        message: 'Etwas ist schiefgelaufen. Bitte versuche es nochmal.',
      })
    }
  }
  if (isSuccess) return <SignupSuccess email={email} />
  return (
    <>
      <WrapperCard className='sm:mt-[-80px]' size='md' header="Los geht's!">
        <Form {...form}>
          <form
            className='flex flex-col space-y-5'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-700'>Vorname</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        className={cn(
                          form.formState.errors.firstName
                            ? 'border-warning'
                            : 'border-zinc-400',
                          'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
                        )}
                        placeholder='Maria'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-700'>Nachname</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        className={cn(
                          form.formState.errors.lastName
                            ? 'border-warning'
                            : 'border-zinc-400',
                          'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
                        )}
                        placeholder='Muster'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-700'>
                    E-Mail Adresse
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        form.formState.errors.email
                          ? 'border-warning'
                          : 'border-zinc-400',
                        'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
                      )}
                      placeholder='maria@muster.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-700'>Passwort</FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        form.formState.errors.password
                          ? 'border-warning'
                          : 'border-zinc-400',
                        'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
                      )}
                      placeholder='Mindestens 6 Zeichen'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-700'>
                    Passwort-Wiederholung
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        form.formState.errors.password2
                          ? 'border-warning'
                          : 'border-zinc-400',
                        'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
                      )}
                      placeholder='Passwort-Wiederholung'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='terms'
              render={({ field }) => (
                <>
                  <FormItem className='items-tart flex flex-row space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        disabled={form.formState.isSubmitting}
                        className={cn(
                          form.formState.errors.terms
                            ? 'border-warning'
                            : 'border-zinc-400',
                        )}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='text-sm font-normal text-zinc-700'>
                        Ich bin mit den{' '}
                        <a
                          href='https://eleno.net/impressum-datenschutz'
                          target='_blank'
                          rel='noreferrer'
                        >
                          Datenschutzbestimmungen
                        </a>{' '}
                        und der{' '}
                        <a
                          href='https://eleno.net/terms-conditions'
                          target='_blank'
                          rel='noreferrer'
                        >
                          Allgemeinen Geschäftsbedingungen
                        </a>{' '}
                        einverstanden.
                      </FormLabel>
                    </div>
                  </FormItem>
                  {form.formState.errors.terms && (
                    <span className='!mt-1 text-xs text-warning'>
                      {form.formState.errors.terms.message}
                    </span>
                  )}
                </>
              )}
            />
            <div className='flex gap-2 items-center'>
              <Button
                disabled={form.formState.isSubmitting}
                className='w-full'
                type='submit'
              >
                Sign up
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
      </WrapperCard>
    </>
  )
}
