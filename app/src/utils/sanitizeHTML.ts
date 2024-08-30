export function sanitizeHTML(htmlTag: string): string {
  return removeHTMLAttributes(htmlTag).replaceAll('\n', '<br></br>')
}

export function removeHTMLAttributes(htmlTag: string): string {
  const attrRegex = /\s+[a-zA-Z0-9-]+(=(['"]).*?\2)?/g

  // Remove all standard attributes
  return htmlTag.replace(attrRegex, '')
}
