import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { ButtonGoogle } from '@/components/ui/ButtonGoogle.component'
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
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import WrapperCard from './WrapperCard.component'

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

  const onSubmit = async (data: TInput) => {
    searchParams.set('email', data.email)
    setSearchParams(searchParams)
  }

  return (
    <>
      <WrapperCard
        complementary={
          <p className='text-xs text-zinc-500'>
            <a
              className='text-zinc-500 !decoration-zinc-300'
              href='https://eleno.net/terms-conditions'
              target='_blank'
              rel='noreferrer'
            >
              Allgemeine Geschäftsbedingungen
            </a>{' '}
            und{' '}
            <a
              className='text-zinc-500 !decoration-zinc-300'
              href='https://eleno.net/impressum-datenschutz'
              target='_blank'
              rel='noreferrer'
            >
              Datenschutzrichtlinien
            </a>
          </p>
        }
        size='sm'
        header='Schön, dich wiederzusehen!'
      >
        <Form {...form}>
          <form
            className='flex flex-col space-y-4'
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
          <span className='text-sm text-zinc-500'>ODER</span>
          <Separator className='shrink' />
        </div>
        <ButtonGoogle />
        <p className='!mt-8 text-center text-sm text-zinc-500 '>
          Noch kein Benutzerkonto?{' '}
          <Link to='/?page=signup'>Jetzt loslegen!</Link>
        </p>
      </WrapperCard>
    </>
  )
}
