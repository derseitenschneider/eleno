export function sanitizeHTMLforPDF(html: string): string {
  return removeHTMLAttributes(html).replaceAll('\n', '<br></br>')
}

export function saniziteHtmlforEditor(html: string): string {
  return replaceDisallowedTags(removeHTMLAttributes(html))
}

export function removeHTMLAttributes(html: string): string {
  const tagRegex = /(<(\w+)((?:\s+[^>]*)?)>)|([^<]+)/g

  return html.replace(
    tagRegex,
    (match, fullTag, tagName, attributes, textContent) => {
      // If it's text content, return it as is
      if (textContent) {
        return textContent
      }

      // If it's not an 'a' tag, remove all attributes
      if (tagName.toLowerCase() !== 'a') {
        return `<${tagName}>`
      }

      // For 'a' tags, keep href and target attributes
      const hrefMatch = attributes.match(/\s+href\s*=\s*("[^"]*"|'[^']*'|\S+)/)
      const targetMatch = attributes.match(
        /\s+target\s*=\s*("[^"]*"|'[^']*'|\S+)/,
      )

      const href = hrefMatch ? hrefMatch[0].trim() : ''
      const target = targetMatch ? targetMatch[0].trim() : ''

      return `<${tagName}${href ? ` ${href}` : ''}${target ? ` ${target}` : ''}>`
    },
  )
}

function replaceDisallowedTags(html: string): string {
  const allowedTags = ['div', 'b', 'i', 'strike', 'u', 'ul', 'ol', 'li', 'a']
  const tagRegex = /<\/?([a-z][a-z0-9]*)[^>]*>/gi
  const allowedTagSet = new Set(allowedTags.map((tag) => tag.toLowerCase()))

  // Step 1: Replace disallowed tags
  let processedHtml = html.replace(tagRegex, (match, tagName) => {
    const tag = tagName.toLowerCase()
    if (allowedTagSet.has(tag)) {
      return match
    }
    if (match.startsWith('</')) {
      return '</div>'
    }
    return '<div>'
  })

  // Step 2: Remove empty div tags
  const emptyDivRegex = /<div>\s*<\/div>/g
  while (emptyDivRegex.test(processedHtml)) {
    processedHtml = processedHtml.replace(emptyDivRegex, '')
  }

  // Step 3: Trim whitespace before first div and after last div
  processedHtml = processedHtml.replace(/^\s*(<div>[\s\S]*<\/div>)\s*$/, '$1')

  return processedHtml
}
