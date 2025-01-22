import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import useIsOnline from './useIsOnline'

const useFetchErrorToast = () => {
  const isOnline = useIsOnline()

  return (
    error = 'Fehlermeldung',
    message = "Etwas ist schiefgelaufen, versuch's nochmal.",
  ) => {
    if (isOnline) {
      return toast.error(message, {
        closeButton: true,
        classNames: {
          actionButton: 'underline !text-foreground !bg-background50',
        },
        icon: <AlertCircle className='text-noteRed size-5' />,
        action: {
          label: 'Fehler melden',
          onClick: () => {
            window.location.href = `mailto:info@eleno.net?subject=Error: ${error}`
          },
        },
        duration: Number.POSITIVE_INFINITY,
      })
    }
  }
}

export default useFetchErrorToast
