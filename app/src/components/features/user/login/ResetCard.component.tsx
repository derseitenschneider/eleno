import { useForm } from "react-hook-form"
import WrapperCard from "./WrapperCard.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { recoverPasswordSupabase } from "@/services/api/user.api"
import { useSearchParams } from "react-router-dom"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { cn } from "@/lib/utils"

const resetSchema = z.object({
  email: z
    .string({ required_error: "E-Mail Adresse fehlt." })
    .min(1, { message: "E-Mail Adresse fehlt." })
    .email({ message: "Keine gültige E-Mail Adresse." }),
})

type TInput = z.infer<typeof resetSchema>

export default function ResetCard() {
  const [, setSearchParams] = useSearchParams()

  const form = useForm<TInput>({
    resolver: zodResolver(resetSchema),
    mode: "onSubmit",
    shouldFocusError: true,
  })

  const onSubmit = async (data: TInput) => {
    try {
      await recoverPasswordSupabase(data.email)
    } catch {
      form.setFocus("email")
      form.setError("root", {
        message:
          "Passwort zurücksetzten zurzeit nicht möglich. Versuch es später noch einmal.",
      })
    }
  }

  return (
    <WrapperCard
      complementary={
        <p className=' text-center text-sm text-zinc-700'>
          Noch kein Benutzerkonto?{" "}
          <a onClick={() => setSearchParams({ page: "signup" })}>Sign up</a>
        </p>
      }
      header='Passwort zurücksetzten'
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
                <FormLabel className='text-zinc-700 '>E-Mail Adresse</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder='E-Mail Adresse'
                    {...field}
                    className={cn(
                      form.formState.errors.email
                        ? "border-warning"
                        : "border-zinc-400",
                    )}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Du erhältst einen Link zum zurücksetzten deines Passworts.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className='flex gap-2 items-center'>
            <Button
              size='sm'
              disabled={form.formState.isSubmitting}
              type='submit'
              className='w-full'
            >
              Passwort zurücksetzten
            </Button>
            {form.formState.isSubmitting && <MiniLoader />}
          </div>
        </form>
      </Form>
    </WrapperCard>
  )
}
