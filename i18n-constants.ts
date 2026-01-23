// Centralized i18n constants for maintainability
export const locales = ['id', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'id'
export const fallbackLocales: Locale[] = ['id', 'en']
export const browserFallbackLocale: Locale = 'en'

export const languageNames: { [locale in Locale]: string } = {
  id: 'Indonesia',
  en: 'English',
}

export const languageCodes: { [locale in Locale]: string } = {
  id: 'id-ID',
  en: 'en-US',
}
