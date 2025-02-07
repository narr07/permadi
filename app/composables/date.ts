export function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(
    locale === 'id' ? 'id-ID' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}
