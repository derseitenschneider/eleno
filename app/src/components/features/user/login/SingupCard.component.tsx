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

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Gib deinen Vornamen ein' }),
    lastName: z.string().min(1, { message: 'Gib deinen Nachnamen ein' }),
    email: z.string().email({ message: 'Gib eine gültige E-Mail Adresse ein' }),
    password: z.string().min(1, { message: 'Gib ein Passwort ein' }),
    password2: z
      .string()
      .min(1, { message: 'Gib die Passwortwiederholung ein' }),
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
    message: 'Die Passwörter stimmt nicht überein',
    path: ['password2'],
  })

type TInput = z.infer<typeof signupSchema>

export default function SignupCard() {
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
  return (
    <div
      className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20"
    >
      <WrapperCard header="Willkommen zurück">
        <Form {...form}>
          <form
            className="flex flex-col space-y-6"
            onSubmit={form.handleSubmit((data) => {
              console.log(data)
            })}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Nachname</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <FormLabel>E-Mail Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
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
                  <FormLabel>Passwort Wiederholung</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
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
