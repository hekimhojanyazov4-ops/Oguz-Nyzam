import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ru from './locales/ru.json'
import tk from './locales/tk.json'

const supportedLanguages = ['en', 'ru', 'tk']
const savedLanguage = localStorage.getItem('language')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      tk: { translation: tk }
    },
    lng: supportedLanguages.includes(savedLanguage) ? savedLanguage : 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

document.documentElement.lang = i18n.resolvedLanguage || 'en'

i18n.on('languageChanged', (language) => {
  if (supportedLanguages.includes(language)) {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }
})

export default i18n
