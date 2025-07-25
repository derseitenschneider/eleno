import { Link, useSearchParams } from 'react-router-dom'
import WrapperCard from '../login/WrapperCard.component'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Separator } from '@/components/ui/separator'
import { ButtonGoogle } from '@/components/ui/ButtonGoogle.component'

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-Mail Adresse fehlt.' })
    .email({ message: 'Ungültige E-Mail Adresse!' })
    .refine((email) => !email.includes('@example'), {
      message: 'Unerlaubte E-Mail Adresse.',
    }),
})

type TInput = z.infer<typeof emailSchema>

export function SignupCardEmail() {
  const [searchParams, setSearchParams] = useSearchParams()

  const form = useForm<TInput>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(emailSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    searchParams.set('email', data.email)
    setSearchParams(searchParams)
  }

  return (
    <WrapperCard
      complementary={
        <p className='text-center text-sm text-zinc-500 !decoration-zinc-300 sm:w-[40ch]'>
          Durch die Erstellung eines Kontos stimmst du den{' '}
          <Link
            className='text-zinc-500 !decoration-zinc-300'
            target='_blank'
            to='https://eleno.net/terms-conditions'
          >
            Allgemeinen Geschäftsbedingungen
          </Link>{' '}
          und den{' '}
          <Link
            className='text-zinc-500 !decoration-zinc-300'
            target='_blank'
            to='https://eleno.net/impressum-datenschutz'
          >
            Datenschutzrichtlinien
          </Link>{' '}
          zu.
        </p>
      }
      className='sm:mt-[-80px]'
      size='sm'
      header='Eleno starten: Mehr Zeit für deine Musik'
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
                      'bg-zinc-50 text-zinc-700 ring-offset-zinc-50 placeholder:text-zinc-400 focus visible:ring-primary',
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
        Bereits ein Benutzerkonto?{' '}
        <Link to='/?page=login'>Jetzt einloggen</Link>
      </p>
    </WrapperCard>
  )
}
