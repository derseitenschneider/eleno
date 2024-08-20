export default function stripHtmlTags(string: string) {
  const noAttributes = string.replace(/<([^>]*?)(\s[^>]*)?>/g, '<$1>')

  const newString = noAttributes
    .replaceAll('<ul>', '')
    .replaceAll('</ul>', '')
    .replaceAll('<li>', '• ')
    .replaceAll('</li>', '\n')
    .replaceAll('<div>', '\n')
    .replaceAll('</div>', '')
    .replaceAll('-&gt;', '➔ ')
    .replaceAll('<br>', '\n')
    .replace('</br>', '')
    .replaceAll('<span>', '')
    .replaceAll('<span >', '')
    .replaceAll('</span>', '')
    .replaceAll('&nbsp;', '')
    .replaceAll('<ol>', '')
    .replaceAll('</ol>', '')
    .replaceAll('<b>', '')
    .replaceAll('</b>', '')
    .replaceAll('<i>', '')
    .replaceAll('</i>', '')
    .replaceAll('<u>', '')
    .replaceAll('</u>', '')
    .replaceAll('<a>', '')
    .replaceAll('<a >', '')
    .replaceAll('</a>', '')
    .replaceAll('&amp;', '&')

  return newString
}
