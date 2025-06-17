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
import MiniLoader from '@/components/ui/MiniLoader.component'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { loginSupabase } from '@/services/api/user.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import WrapperCard from './WrapperCard.component'
import supabase from '@/services/api/supabase'
import { Separator } from '@/components/ui/separator'
import { ButtonGoogle } from '@/components/ui/ButtonGoogle.component'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-Mail Adresse fehlt.' })
    .email({ message: 'Keine gültige E-Mail Adresse.' }),
})

type TInput = z.infer<typeof loginSchema>

export default function LoginCardEmail() {
  const [searchParams, setSearchParams] = useSearchParams()
  const form = useForm<TInput>({
    defaultValues: {
      email: '',
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
  }, [form])

  const onSubmit = async (data: TInput) => {
    searchParams.set('email', data.email)
  }

  return (
    <>
      <WrapperCard
        className='mt-[-80px]'
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
                  <FormLabel className='font-semibold text-zinc-700'>
                    E-Mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid='login-email'
                      type='email'
                      spellCheck={false}
                      autoCapitalize='off'
                      autoComplete='email'
                      autoFocus
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        form.formState.errors.email
                          ? 'border-warning'
                          : 'border-zinc-400',
                        'bg-zinc-50 text-zinc-700 placeholder:text-zinc-400',
                      )}
                      placeholder='Deine E-Mail'
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
    </>
  )
}
