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
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Logo from '@/components/ui/Logo.component'
import { useUser } from '@/services/context/UserContext'
import { ArrowRightIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUpdateProfileMeta } from '../user/useUpateProfileMeta'
import { useNavigate } from 'react-router-dom'
import { updateFluentCRMContact } from '@/services/api/fluent-crm.api'

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'Vorname fehlt.' }),
  lastName: z.string().min(1, { message: 'Nachname fehlt.' }),
})

type TInput = z.infer<typeof profileSchema>

export default function ProfileCard() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { updateProfileMeta, isUpdating } = useUpdateProfileMeta()
  const form = useForm<TInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    if (!user?.email) return
    try {
      updateProfileMeta(data, {
        onSuccess: () => navigate('/onboarding/first-steps'),
      })
      await updateFluentCRMContact({
        __force_update: 'yes',
        first_name: data.firstName,
        last_name: data.lastName,
        email: user.email,
        detach_lists: [13],
        lists: [14],
        status: 'subscribed',
      })
    } catch (e) {
      console.error(e)
    }
  }

  if (!user) return null
  return (
    <div className='justify-self-center sm:w-[32rem]'>
      <Card className='rounded-xl p-8 sm:p-12'>
        <CardHeader className='p-0 pb-6'>
          <Logo className='mb-4 w-16' />
          <h3 className='!mt-0 text-2xl font-medium'>
            Erzähl uns mehr über dich
          </h3>
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
              <div className='flex flex-col gap-2 sm:flex-row '>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem className='sm:w-1/2'>
                      <FormLabel className='font-medium'>Vorname</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            form.formState.errors.firstName
                              ? 'border-warning'
                              : 'border-zinc-400/50',
                          )}
                          placeholder='Vorname'
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
                    <FormItem className='sm:w-1/2'>
                      <FormLabel className='font-medium'>Nachname</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          placeholder='Nachname'
                          className={cn(
                            form.formState.errors.lastName
                              ? 'border-warning'
                              : 'border-zinc-400/50',
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  disabled={
                    form.formState.isSubmitting ||
                    !form.getValues('firstName') ||
                    !form.getValues('lastName')
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
