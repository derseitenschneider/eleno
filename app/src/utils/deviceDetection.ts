export function isPhone(): boolean {
  // This is a simple heuristic. You might want to adjust these values based on your definition of a "phone"
  const minPhoneWidth = 320
  const maxPhoneWidth = 812 // iPhone 12 Pro Max width in portrait

  return (
    window.screen.width >= minPhoneWidth && window.screen.width <= maxPhoneWidth
  )
}
