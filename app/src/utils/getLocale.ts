import { de, enIN } from 'date-fns/locale'
import type { TLocale } from '@/services/context/UserLocaleContext'

export default function getLocale(localeString: TLocale) {
  const localeMap = {
    de: de,
    en: enIN,
  }
  return localeMap[localeString] || undefined
}
