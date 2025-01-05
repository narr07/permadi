import en from '~~/i18n/lang/en'
import id from '~~/i18n/lang/id'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'id',
  messages: {
    en,
    id,
  },
}))
