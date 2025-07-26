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
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Logo from '@/components/ui/Logo.component'
import { useUser } from '@/services/context/UserContext'
import { ArrowRightIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { updateFluentCRMContact } from '@/services/api/fluent-crm.api'
import { PasswordInput } from '@/components/ui/password-input'
import supabase from '@/services/api/supabase'
import { useState } from 'react'

const passwordSchema = z.object({
  password: z.string().min(1, { message: 'Passwort fehlt' }),
})

type TInput = z.infer<typeof passwordSchema>

export default function PasswordCard() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { user } = useUser()
  const navigate = useNavigate()

  const form = useForm<TInput>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(passwordSchema),
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const onSubmit = async (input: TInput) => {
    if (!user?.email) return
    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: input.password,
        data: { from_funnel: false },
      })

      if (error) throw new Error(error.message)

      await updateFluentCRMContact({
        __force_update: 'yes',
        email: user.email,
        detach_lists: [13],
        lists: [14],
        status: 'subscribed',
      })

      navigate('/onboarding/first-steps')
    } catch (e) {
      console.error(e)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null
  return (
    <div className='justify-self-center sm:w-[32rem]'>
      <Card className='rounded-xl p-8 sm:p-12'>
        <CardHeader className='p-0 pb-6'>
          <Logo className='mb-4 w-16' />
          <h3 className='!mt-0 text-2xl font-medium'>Erstelle ein Passwort</h3>
          <p>
            Du hast es fast geschafft. Lege noch dein Passwort fest und schon
            kannst du loslegen.
          </p>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='mb-4 flex items-center gap-2'>
            <Avatar className='h-6 w-6'>
              <AvatarFallback className='text-sm'>
                {user.email?.at(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className='text-base text-foreground'>{user.email}</p>
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
                  disabled={
                    form.formState.isSubmitting || !form.getValues('password')
                  }
                  className='ml-auto'
                  type='submit'
                >
                  Weiter
                  <ArrowRightIcon className='ml-2 w-5' />
                </Button>

                {isUpdating && <MiniLoader />}
              </div>
              {form.formState.errors.root && (
                <p className='text-center text-sm text-warning'>
                  {form.formState.errors.root.message}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
