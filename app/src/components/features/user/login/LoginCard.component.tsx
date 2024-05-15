import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { PasswordInput } from "@/components/ui/password-input"
import { cn } from "@/lib/utils"
import { loginSupabase } from "@/services/api/user.api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import WrapperCard from "./WrapperCard.component"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-Mail Adresse fehlt." })
    .email({ message: "Keine gültige E-Mail Adresse." }),
  password: z.string().min(1, { message: "Passwort fehlt." }),
})

type TInput = z.infer<typeof loginSchema>

export default function LoginCard() {
  const form = useForm<TInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  useEffect(() => {
    form.setFocus("email")
  }, [form])

  const onSubmit = async (data: TInput) => {
    try {
      await loginSupabase(data.email, data.password)
    } catch {
      form.setFocus("email")
      form.setError("root", {
        message: "E-Mail Adresse und/oder Passwort ungültig.",
      })
    }
  }

  return (
    <>
      <WrapperCard
        size='sm'
        complementary={
          <p className='text-center text-sm text-zinc-700 '>
            Noch kein Benutzerkonto? <Link to='/?page=signup'>Sign up</Link>
          </p>
        }
        header='Willkommen zurück!'
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
                  <FormLabel className='text-zinc-700'>
                    E-Mail Adresse
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        form.formState.errors.email
                          ? "border-warning"
                          : "border-zinc-400",
                      )}
                      placeholder='E-Mail Adresse'
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
                      placeholder='Passwort'
                      className={cn(
                        form.formState.errors.password
                          ? "border-warning"
                          : "border-zinc-400",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              to='/?page=reset'
              className='translate-y-[-10px] text-right text-sm'
            >
              Passwort vergessen?
            </Link>
            <div className='flex gap-2 items-center'>
              <Button
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
      </WrapperCard>
    </>
  )
}
