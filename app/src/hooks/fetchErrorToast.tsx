import { toast } from "sonner"

const fetchErrorToast = () => {
  return toast.error("Etwas ist schiefgelaufen. Versuch's nochmal.", {
    classNames: {
      actionButton: "underline",
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
