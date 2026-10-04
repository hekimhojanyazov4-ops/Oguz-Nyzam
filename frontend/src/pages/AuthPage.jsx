import { useState } from 'react'
import {
  Eye,
  EyeOff,
  User,
  GraduationCap,
  LockKeyhole,
  LogIn,
  UserPlus,
  ArrowRight,
  ClipboardCheck,
  Users,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'

export default function AuthPage({ login, register }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [facultyId, setFacultyId] = useState('')
  const [notice, setNotice] = useState('')

  const { data: faculties } = useApiResource(
    mode === 'register' ? '/Faculties' : null
  )

  const { pending, error, run } = useAsyncAction()

  async function submit(event) {
    event.preventDefault()
    setNotice('')

    const values = {
      FullName: fullName.trim(),
      Password: password,
    }

    const result = await run(() =>
      mode === 'login'
        ? login(values)
        : register({
            ...values,
            FacultyId: Number(facultyId),
          })
    )

    if (result && mode === 'register') {
      setNotice(true)

      setMode('login')
      setPassword('')
      setShowPassword(false)
    }
  }

  return (
    <main className="auth-layout">

      {/* LEFT */}
      <section className="auth-panel">

        <div className="brand-mark">
          ON<span> / </span>01
        </div>

        <p className="eyebrow">
          {t('brand.title')} · {t('brand.subtitle')}
        </p>

        <h1>
          {mode === 'login'
            ? t('auth.welcomeBack')
            : t('auth.joinPortal')}
        </h1>

        <p className="auth-copy">
          {t('auth.description')}
        </p>

        <form className="form-stack" onSubmit={submit}>

          {/* FULL NAME */}
          <label className="input-label">
            {t('auth.fullName')}

            <div className="input-wrapper">
              <User className="input-icon" size={19} />

              <input
                autoComplete="name"
                placeholder={t('auth.fullNamePlaceholder')}
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
              />
            </div>
          </label>


          {/* FACULTY */}
          {mode === 'register' && (
            <label className="input-label">
              {t('auth.faculty')}

              <div className="input-wrapper">
                <GraduationCap
                  className="input-icon"
                  size={20}
                />

                <select
                  value={facultyId}
                  onChange={(event) =>
                    setFacultyId(event.target.value)
                  }
                  required
                >
                  <option value="">
                    {t('auth.chooseFaculty')}
                  </option>

                  {faculties.map((faculty) => (
                    <option
                      key={faculty.id}
                      value={faculty.id}
                    >
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          )}


          {/* PASSWORD */}
          <label className="input-label">
            {t('auth.password')}

            <div className="input-wrapper">
              <LockKeyhole
                className="input-icon"
                size={19}
              />

              <input
                autoComplete={
                  mode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? t('auth.hidePassword')
                    : t('auth.showPassword')
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </label>


          {/* ERROR */}
          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}


          {/* SUCCESS */}
          {notice && (
            <p
              className="form-success"
              role="status"
            >
              <CheckCircle2 size={17} />
              {t('auth.registrationSubmitted')}
            </p>
          )}


          {/* SUBMIT */}
          <button
            className="button button-primary button-wide"
            disabled={pending}
            type="submit"
          >
            {pending ? (
              t('auth.pleaseWait')
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                {t('auth.signIn')}
              </>
            ) : (
              <>
                <UserPlus size={18} />
                {t('auth.createAccount')}
              </>
            )}
          </button>

        </form>


        {/* SWITCH MODE */}
        <button
          className="text-button"
          onClick={() => {
            setMode(
              mode === 'login'
                ? 'register'
                : 'login'
            )

            setNotice('')
            setShowPassword(false)
          }}
        >
          {mode === 'login' ? (
            <>
              {t('auth.newToPortal')}
              <span>{t('auth.register')}</span>
              <ArrowRight size={16} />
            </>
          ) : (
            <>
              {t('auth.alreadyRegistered')}
              <span>{t('auth.signIn')}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

      </section>


      {/* RIGHT */}
      <aside className="auth-aside">

        <div className="aside-index">
          01 — 03
        </div>


        <div className="aside-content">

          <p className="eyebrow">
            {t('auth.tagline')}
          </p>

          <h2>
            {t('auth.asideHeading')}
          </h2>


          {/* FEATURES */}
          <div className="aside-features">

            <div className="aside-feature">
              <div className="feature-icon">
                <ClipboardCheck size={20} />
              </div>

              <div>
                <strong>{t('auth.attendanceFeature')}</strong>
                <span>
                  {t('auth.attendanceDescription')}
                </span>
              </div>
            </div>


            <div className="aside-feature">
              <div className="feature-icon">
                <Users size={20} />
              </div>

              <div>
                <strong>{t('auth.studentsFeature')}</strong>
                <span>
                  {t('auth.studentsDescription')}
                </span>
              </div>
            </div>


            <div className="aside-feature">
              <div className="feature-icon">
                <Building2 size={20} />
              </div>

              <div>
                <strong>{t('auth.facultiesFeature')}</strong>
                <span>
                  {t('auth.facultiesDescription')}
                </span>
              </div>
            </div>

          </div>

        </div>


        <div className="aside-rule">
          <span />
          {t('auth.attendanceFeature')} · {t('auth.studentsFeature')} · {t('auth.facultiesFeature')}
        </div>

      </aside>

    </main>
  )
}
