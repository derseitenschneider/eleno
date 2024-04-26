import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { loginSupabase } from '@/services/api/user.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import WrapperCard from './WrapperCard.component'

const loginSchema = z.object({
  email: z.string().email({ message: 'Keine gültige E-Mail Adresse!' }),
  password: z.string().min(1, { message: 'Passwort fehlt!' }),
})

type TInput = z.infer<typeof loginSchema>

export default function LoginCard() {
  const [_, setSearchParams] = useSearchParams()

  const form = useForm<TInput>({
    defaultValues: {
      email: '',
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

  useEffect(() => {
    form.setFocus('email')
  }, [])

  const onSubmit = async (data: TInput) => {
    try {
      await loginSupabase(data.email, data.password)
    } catch {
      form.setFocus('email')
      form.setError('root', {
        message: 'E-Mail Adresse und/oder Passwort ungültig.',
      })
    }
  }

  return (
    <>
      <WrapperCard
        size="sm"
        complementary={
          <p className="text-center text-sm text-zinc-700 ">
            Noch kein Benutzerkonto?{' '}
            <a onClick={() => setSearchParams({ page: 'signup' })}>Sign up</a>
          </p>
        }
        header="Willkommen zurück!"
      >
        <Form {...form}>
          <form
            className="flex flex-col space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700">
                    E-Mail Adresse
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border border-zinc-400 bg-zinc-50 text-zinc-700 ring-offset-zinc-50
                        placeholder:text-zinc-400 focus-visible:ring-primary"
                      placeholder="E-Mail Adresse"
                      {...field}
                    />
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
                  <FormLabel className="text-zinc-700">Passwort</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Passwort"
                      className="border border-zinc-400 bg-zinc-50 text-zinc-700 ring-offset-zinc-50
                        placeholder:text-zinc-400 focus-visible:ring-primary"
                      {...field}
                    />
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
              Login
            </Button>
            {form.formState.errors.root && (
              <p className="text-center text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
        <a
          onClick={() => setSearchParams({ page: 'reset' })}
          className="text-center text-sm"
        >
          Passwort vergessen?
        </a>
      </WrapperCard>
    </>
  )
}
