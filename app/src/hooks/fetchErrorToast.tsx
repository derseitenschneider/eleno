import { toast } from 'react-toastify'

const fetchErrorToast = () => {
  return toast(
    'Etwas ist schiefgelaufen. Versuchs nochmal oder lade die Seite neu...',
    { type: 'error' },
  )
}

export default fetchErrorToast
