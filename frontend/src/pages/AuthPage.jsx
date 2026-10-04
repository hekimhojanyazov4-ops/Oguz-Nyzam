import { useState } from 'react'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'

export default function AuthPage({ login, register }) {
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [facultyId, setFacultyId] = useState('')
  const [notice, setNotice] = useState('')
  const { data: faculties } = useApiResource(mode === 'register' ? '/Faculties' : null)
  const { pending, error, run } = useAsyncAction()

  async function submit(event) {
    event.preventDefault()
    setNotice('')
    const values = { FullName: fullName.trim(), Password: password }
    const result = await run(() => mode === 'login'
      ? login(values)
      : register({ ...values, FacultyId: Number(facultyId) }))
    if (result && mode === 'register') {
      setNotice('Registration submitted. An administrator must approve your account before you can sign in.')
      setMode('login')
      setPassword('')
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand-mark">ON<span> / </span>01</div>
        <p className="eyebrow">OGUZ NYZAM · CAMPUS PORTAL</p>
        <h1>{mode === 'login' ? 'Welcome back.' : 'Join the portal.'}</h1>
        <p className="auth-copy">Attendance, student records, and faculty administration in one place.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>Full name<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>
          {mode === 'register' && (
            <label>Faculty
              <select value={facultyId} onChange={(event) => setFacultyId(event.target.value)} required>
                <option value="">Choose faculty</option>
                {faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.name}</option>)}
              </select>
            </label>
          )}
          <label>Password<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          {notice && <p className="form-success" role="status">{notice}</p>}
          <button className="button button-primary button-wide" disabled={pending} type="submit">
            {pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button className="text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice('') }}>
          {mode === 'login' ? 'New to the portal? Register' : 'Already registered? Sign in'}
        </button>
      </section>
      <aside className="auth-aside">
        <div className="aside-index">01 — 03</div>
        <div>
          <p className="eyebrow">A CLEARER CAMPUS DAY</p>
          <h2>Good records make better routines.</h2>
        </div>
        <div className="aside-rule"><span /> Attendance · Students · Faculties</div>
      </aside>
    </main>
  )
}
