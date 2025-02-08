// app/composables/useReadingTime.ts
function extractTextFromBody(body: any): string {
  if (!body?.value || !Array.isArray(body.value))
    return ''

  return body.value.reduce((text: string, item: any[]) => {
    if (Array.isArray(item)) {
      const content = item.map((element) => {
        if (typeof element === 'string')
          return element
        if (Array.isArray(element))
          return extractTextFromBody({ value: [element] })
        if (element?.value)
          return element.value
        return ''
      }).join(' ')

      return `${text} ${content}`
    }
    return text
  }, '')
}

function calculateReadingTime(body: any): number {
  const text = extractTextFromBody(body)
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function useReadingTime() {
  const { locale } = useI18n()
  const formatReadingTime = (minutes: number): string =>
    locale.value === 'id' ? `${minutes} menit baca` : `${minutes} min read`

  return {
    calculateReadingTime,
    formatReadingTime,
  }
}

export default useReadingTime
