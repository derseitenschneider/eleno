import { Form, useForm } from 'react-hook-form'
import WrapperCard from './WrapperCard.component'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const resetSchema = z.object({
  email: z.string().email({ message: 'Email Adresse ungültig' }),
})

type TInput = z.infer<typeof resetSchema>

export default function ResetCard() {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(resetSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  })

  const onSubmit = () => {}

  return (
    <WrapperCard header="Passwort zurücksetzten">
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
              </FormItem>
            )}
          />
          <Button type="submit">Passwort zurücksetzten</Button>
        </form>
      </Form>
    </WrapperCard>
  )
}
