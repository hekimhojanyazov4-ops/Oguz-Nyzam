import { useApiResource } from '../hooks/useApiResource'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, BookOpen, Building2, CalendarDays, ClipboardCheck, GraduationCap, Users } from 'lucide-react'

export default function OverviewPage({ user, onNavigate }) {
  const { t, i18n } = useTranslation()
  const { data: groups } = useApiResource('/Groups')
  const { data: courses } = useApiResource('/Courses')
  const { data: faculties } = useApiResource('/Faculties')
  const firstName = user.fullName.split(' ')[0]

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div><p className="eyebrow">{t('overview.eyebrow')}</p><h1>{t('overview.greeting', { name: firstName })}</h1></div>
        <span className="today-label"><CalendarDays size={15} aria-hidden="true" />{new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'full' }).format(new Date())}</span>
      </section>
      <section className="metrics-row" aria-label={t('overview.directoryTotals')}>
        <Metric Icon={Users} label={t('overview.studyGroups')} directory={t('overview.directory')} value={groups.length} index="01" />
        <Metric Icon={BookOpen} label={t('overview.courses')} directory={t('overview.directory')} value={courses.length} index="02" />
        <Metric Icon={Building2} label={t('overview.faculties')} directory={t('overview.directory')} value={faculties.length} index="03" />
      </section>
      <section className="overview-lower">
        <div className="overview-copy">
          <p className="eyebrow">{t('overview.dailyWorkflow')}</p>
          <h2>{t('overview.workflowHeading')}</h2>
          <p>{t('overview.workflowDescription')}</p>
        </div>
        <div className="quick-links">
          <button className="quick-link" onClick={() => onNavigate('attendance')}><span className="quick-icon"><ClipboardCheck size={18} aria-hidden="true" /></span><span><strong>{t('overview.recordAttendance')}</strong><small>{t('overview.recordAttendanceDescription')}</small></span><ArrowUpRight className="arrow" size={18} aria-hidden="true" /></button>
          <button className="quick-link" onClick={() => onNavigate('students')}><span className="quick-icon"><GraduationCap size={18} aria-hidden="true" /></span><span><strong>{t('overview.studentDirectory')}</strong><small>{t('overview.studentDirectoryDescription')}</small></span><ArrowUpRight className="arrow" size={18} aria-hidden="true" /></button>
          {user.roleId === 1 && <button className="quick-link" onClick={() => onNavigate('admin')}><span className="quick-icon"><Building2 size={18} aria-hidden="true" /></span><span><strong>{t('overview.administration')}</strong><small>{t('overview.administrationDescription')}</small></span><ArrowUpRight className="arrow" size={18} aria-hidden="true" /></button>}
        </div>
      </section>
    </main>
  )
}

function Metric({ Icon, label, directory, value, index }) {
  return <article className="metric"><span className="metric-icon"><Icon size={19} aria-hidden="true" /></span><span className="metric-index">{index} / {directory}</span><strong>{value}</strong><span>{label}</span></article>
}