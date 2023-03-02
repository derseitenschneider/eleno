export const formatDate = (date: string): string => {
  return date.split('-').reverse().join('.')
}
