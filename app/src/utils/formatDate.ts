export function formatDateString(dateString: string, locale: string) {
  const date = new Date(dateString)
  return date.toLocaleString(locale, {
    day: '2-digit',
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
