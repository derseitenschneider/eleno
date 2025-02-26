const getInitials = (firstName: string, lastName: string): string => {
  const names = [firstName, lastName]

  if (names.length === 0) return ''
  if (names.length === 1) return names[0]?.charAt(0).toUpperCase() || ''

  const firstInitial = names[0]?.charAt(0) || ''
  const lastInitial = names[names.length - 1]?.charAt(0) || ''

  return `${firstInitial}${lastInitial}`.toUpperCase()
}

export default getInitials
