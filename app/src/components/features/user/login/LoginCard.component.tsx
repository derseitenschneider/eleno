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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import WrapperCard from './WrapperCard.component'
import { useEffect } from 'react'

const loginSchema = z.object({
  email: z.string().email({ message: 'Gib eine gültige E-Mail Adresse ein' }),
  password: z.string().min(1, { message: 'Gib ein Passwort ein' }),
})

type TInput = z.infer<typeof loginSchema>
export default function LoginCard() {
  const form = useForm<TInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',

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
        message: 'E-Mail Adresse oder Passwort ungültig',
      })
    }
  }

  return (
    <WrapperCard header="Willkommen zurück">
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
                <FormLabel>E-Mail Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="E-Mail Adresse" {...field} />
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
                  <PasswordInput
                    placeholder="Passwort"
                    // value={field.value}
                    // onChange={field.onChange}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className=" w-full" type="submit">
            Login
          </Button>
          {form.formState.errors.root && (
            <p className="text-center text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
      <a onClick={() => form.reset()} className="text-center text-sm">
        Passwort vergessen?
      </a>
    </WrapperCard>
  )
}
