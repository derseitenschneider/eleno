import { useForm } from 'react-hook-form'
import WrapperCard from './WrapperCard.component'
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
import { Button } from '@/components/ui/button'
import { recoverPasswordSupabase } from '@/services/api/user.api'

const resetSchema = z.object({
  email: z.string().email({ message: 'Keine gültige E-Mail Adresse.' }),
})

type TInput = z.infer<typeof resetSchema>

export default function ResetCard() {
  const form = useForm<TInput>({
    resolver: zodResolver(resetSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    try {
      await recoverPasswordSupabase(data.email)
    } catch {
      form.setFocus('email')
      form.setError('root', {
        message:
          'Passwort zurücksetzten zurzeit nicht möglich. Versuch es später noch einmal.',
      })
    }
  }

  return (
    <WrapperCard className="bg-zinc-50" header="Passwort zurücksetzten">
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
                <FormLabel className="text-zinc-700 ">E-Mail Adresse</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E-Mail Adresse"
                    {...field}
                    className="border border-zinc-400 bg-zinc-50 text-zinc-700 ring-offset-zinc-50
                      placeholder:text-zinc-400 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Passwort zurücksetzten</Button>
        </form>
      </Form>
    </WrapperCard>
  )
}
