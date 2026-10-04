import { useApiResource } from '../hooks/useApiResource'

export default function OverviewPage({ user, onNavigate }) {
  const { data: groups } = useApiResource('/Groups')
  const { data: courses } = useApiResource('/Courses')
  const { data: faculties } = useApiResource('/Faculties')
  const firstName = user.fullName.split(' ')[0]

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div><p className="eyebrow">CAMPUS OPERATIONS / OVERVIEW</p><h1>Good day, {firstName}.</h1></div>
        <span className="today-label">{new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date())}</span>
      </section>
      <section className="metrics-row" aria-label="Directory totals">
        <Metric label="Study groups" value={groups.length} index="01" />
        <Metric label="Courses" value={courses.length} index="02" />
        <Metric label="Faculties" value={faculties.length} index="03" />
      </section>
      <section className="overview-lower">
        <div className="overview-copy">
          <p className="eyebrow">DAILY WORKFLOW</p>
          <h2>Keep the record moving.</h2>
          <p>Open a group roster, record attendance, or update student details. Your access is based on your assigned role.</p>
        </div>
        <div className="quick-links">
          <button className="quick-link" onClick={() => onNavigate('attendance')}><span className="quick-number">01</span><span><strong>Record attendance</strong><small>Mark a group's daily record</small></span><span className="arrow">↗</span></button>
          <button className="quick-link" onClick={() => onNavigate('students')}><span className="quick-number">02</span><span><strong>Student directory</strong><small>Search, add, and update students</small></span><span className="arrow">↗</span></button>
          {user.roleId === 1 && <button className="quick-link" onClick={() => onNavigate('admin')}><span className="quick-number">03</span><span><strong>Administration</strong><small>Accounts and academic structure</small></span><span className="arrow">↗</span></button>}
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value, index }) {
  return <article className="metric"><span className="metric-index">{index} / DIRECTORY</span><strong>{value}</strong><span>{label}</span></article>
}