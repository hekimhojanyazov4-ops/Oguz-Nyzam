import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'tk', label: 'Türkmençe' },
]

export default function LanguageSelector({ className = '' }) {
  const { t, i18n } = useTranslation()

  return (
    <label className={`language-selector ${className}`.trim()}>
      <span className="visually-hidden">{t('language.label')}</span>
      <select
        aria-label={t('language.label')}
        value={i18n.resolvedLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
    </label>
  )
}
