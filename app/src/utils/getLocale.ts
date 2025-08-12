import type { TLocale } from '@/services/context/UserLocaleContext'
import { de, enIN } from 'date-fns/locale'

export default function getLocale(localeString: TLocale) {
  const localeMap = {
    de: de,
    en: enIN,
  }
  return localeMap[localeString] || undefined
}
