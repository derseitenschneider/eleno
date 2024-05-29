import { toast } from "sonner"

const fetchErrorToast = (
  message = "Etwas ist schiefgelaufen. Versuch's nochmal.",
) => {
  return toast.error(message, {
    classNames: {
      actionButton: "text-primary underline",
    },
    action: {
      label: "Fehler melden",
      onClick: () => {
        window.location.href = "mailto:info@eleno.net"
      },
    },
    duration: 10 * 1000,
  })
}

export default fetchErrorToast
