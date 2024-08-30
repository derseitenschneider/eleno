export function sanitizeHTMLforPDF(htmlTag: string): string {
  return removeHTMLAttributes(htmlTag).replaceAll('\n', '<br></br>')
}

export function removeHTMLAttributes(htmlTag: string): string {
  const tagRegex = /<(\w+)(?:\s+[^>]*)?>/g
  return htmlTag.replace(tagRegex, (_, tagName) => `<${tagName}>`)
}
