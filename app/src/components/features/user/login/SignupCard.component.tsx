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
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import SuccessCard from './SuccessCard.component'
import { signUpSupabase } from '@/services/api/user.api'

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Vorname fehlt' }),
    lastName: z.string().min(1, { message: 'Nachname fehlt' }),
    email: z.string().email({ message: 'Ungültige E-Mail Adresse' }),
    password: z.string().min(1, { message: 'Passwort fehlt' }),
    password2: z.string().min(1, { message: 'Passwort Wiederholung fehlt' }),
    terms: z
      .boolean({
        invalid_type_error:
          'Bitte akzeptiere die Datenschutzbestimmungen und die Allgemeinen Geschäftsbedingungen',
      })
      .refine((val) => val, {
        message:
          'Bitte akzeptiere die Datenschutzbestimmungen und die Allgemeinen Geschäftsbedingungen',
      }),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Passwörter stimmen nicht überein',
    path: ['password2'],
  })

type TInput = z.infer<typeof signupSchema>

export default function SignupCard() {
  const [isSuccess, setIsSuccess] = useState(false)

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
      await signUpSupabase(data)
      setIsSuccess(true)
    } catch (error) {
      form.setFocus('email')
      form.setError('root', {
        message: 'Etwas ist schiefgelaufen. Bitte versuche es nochmal.',
      })
    }
  }
  if (isSuccess) return <SuccessCard />
  return (
    <div
      className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20"
    >
      <WrapperCard className='bg-zinc-50' size="md" header="Los geht's!">
        <Form {...form}>
          <form
            className="flex flex-col space-y-7"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-700'>Vorname</FormLabel>
                    <FormControl>
                      <Input className='text-zinc-700 bg-zinc-50 placeholder:text-zinc-600 focus-visible:ring-primary ring-offset-zinc-50 border border-zinc-200' placeholder="Vorname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-700'>Nachname</FormLabel>
                    <FormControl>
                      <Input className='text-zinc-700 bg-zinc-50 placeholder:text-zinc-600 focus-visible:ring-primary ring-offset-zinc-50 border border-zinc-200'
                        placeholder="Nachname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-700'>E-Mail Adresse</FormLabel>
                  <FormControl>
                    <Input className='text-zinc-700 bg-zinc-50 placeholder:text-zinc-600 focus-visible:ring-primary ring-offset-zinc-50 border border-zinc-200' placeholder="E-Mail Adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-700'>Passwort</FormLabel>
                  <FormControl>
                    <PasswordInput className='text-zinc-700 bg-zinc-50 placeholder:text-zinc-600 focus-visible:ring-primary ring-offset-zinc-50 border border-zinc-200' placeholder="Passwort" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-700'>Passwort Wiederholung</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className='text-zinc-700 bg-zinc-50 placeholder:text-zinc-600 focus-visible:ring-primary ring-offset-zinc-50 border border-zinc-200'
                      placeholder="Passwort Wiederholung"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="items-tart flex flex-row space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-zinc-700 font-normal">
                      Ich bin mit den{' '}
                      <a
                        href="https://eleno.net/impressum-datenschutz"
                        target="_blank"
                      >
                        Datenschutzbestimmungen
                      </a>{' '}
                      und der{' '}
                      <a
                        href="https://eleno.net/terms-conditions"
                        target="_blank"
                      >
                        Allgemeinen Geschäftsbedingungen
                      </a>{' '}
                      gelesen
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              className="relative w-full"
              type="submit"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="absolute left-20 animate-spin" />
              )}
              Sign up
            </Button>
            {form.formState.errors.root && (
              <p className="text-center text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
      </WrapperCard>
    </div>
  )
}
