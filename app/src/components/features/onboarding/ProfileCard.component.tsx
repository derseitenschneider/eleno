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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Logo from '@/components/ui/Logo.component'
import { useUser } from '@/services/context/UserContext'
import { ArrowRightIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUpdateProfileMeta } from '../user/useUpateProfileMeta'
import { useNavigate } from 'react-router-dom'
import useProfileQuery from '../user/profileQuery'

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'Vorname fehlt.' }),
  lastName: z.string().min(1, { message: 'Nachname fehlt.' }),
})

type TInput = z.infer<typeof profileSchema>

export default function ProfileCard() {
  const { user } = useUser()
  const { data: profile } = useProfileQuery()
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

  useEffect(() => {
    if (profile?.first_name) {
      navigate('/')
    }
  }, [profile?.first_name, navigate])

  useEffect(() => {
    form.setFocus('firstName')
  }, [form])

  const onSubmit = async (data: TInput) => {
    updateProfileMeta(data, { onSuccess: () => navigate('first-steps') })
  }

  if (!user) return null
  return (
    <div className='justify-self-center sm:w-[32rem]'>
      <Card className='rounded-xl p-12'>
        <CardHeader className='p-0 pb-6'>
          <Logo className='mb-4 w-16' />
          <h3 className='!mt-0 text-2xl font-medium text-zinc-700'>
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
            <p className='text-base text-zinc-700'>{user.email}</p>
          </div>
          <Form {...form}>
            <form
              className='flex flex-col space-y-5'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className='flex gap-2 '>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem className='w-1/2'>
                      <FormLabel className='font-medium text-zinc-700'>
                        Vorname
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            form.formState.errors.firstName
                              ? 'border-warning'
                              : 'border-zinc-400/50',
                            'bg-zinc-50 text-zinc-700 placeholder:text-zinc-700/70',
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
                    <FormItem className='w-1/2'>
                      <FormLabel className='font-medium text-zinc-700'>
                        Nachname
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          placeholder='Nachname'
                          className={cn(
                            form.formState.errors.lastName
                              ? 'border-warning'
                              : 'border-zinc-400/50',
                            'bg-zinc-50 text-zinc-700 placeholder:text-zinc-700/70',
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
