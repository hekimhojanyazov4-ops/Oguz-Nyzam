import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiPost } from '../api'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { ArrowUpRight, CalendarDays, ClipboardCheck, Users } from 'lucide-react'

const violations = [
  { id: 1, key: 'absent' },
  { id: 2, key: 'noCard' },
  { id: 3, key: 'uniformIssue' },
]

export default function AttendancePage({ user }) {
  const { t } = useTranslation()
  const { data: groups } = useApiResource('/Groups')
  const [groupId, setGroupId] = useState('')
  const { data: students, loading: studentsLoading } = useApiResource(groupId ? `/Students/group/${groupId}` : null)
  const { data: history, refresh: refreshHistory } = useApiResource(groupId ? `/Attendance/group/${groupId}` : null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [marks, setMarks] = useState({})
  const [saved, setSaved] = useState('')
  const { pending, error, run } = useAsyncAction()

  function changeGroup(event) {
    setGroupId(event.target.value)
    setMarks({})
    setSaved('')
  }

  async function submit(event) {
    event.preventDefault()
    const details = students.map((student) => ({
      StudentId: student.id,
      ViolationCategoryId: marks[student.id]?.categoryId ? Number(marks[student.id].categoryId) : null,
      Note: marks[student.id]?.note?.trim() || null,
    }))
    const result = await run(() => apiPost('/Attendance', {
      Date: date,
      GroupId: Number(groupId),
      TeacherId: user.id,
      Details: details,
    }))
    if (result) {
      setSaved(students.length)
      setMarks({})
      refreshHistory()
    }
  }

  async function loadHistory(recordId) {
    const record = history.find((item) => item.id === recordId)
    if (!record) return
    const nextMarks = Object.fromEntries(record.details.map((detail) => [detail.studentId, {
      categoryId: detail.violationCategoryId || '',
      note: detail.note || '',
    }]))
    setMarks(nextMarks)
    setDate(record.date)
  }

  return (
    <main className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">{t('attendance.eyebrow')}</p><h1><ClipboardCheck size={30} aria-hidden="true" />{t('attendance.heading')}</h1></div><span className="section-count"><Users size={15} aria-hidden="true" />{t('attendance.groupCount', { count: groups.length })}</span></section>
      <section className="toolbar-row">
        <label className="compact-field">{t('attendance.studyGroup')}<select value={groupId} onChange={changeGroup}><option value="">{t('attendance.selectGroup')}</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.groupNumber} · {t('attendance.course')} {group.courseNumber}</option>)}</select></label>
        <label className="compact-field date-field"><span><CalendarDays size={14} aria-hidden="true" />{t('attendance.recordDate')}</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
      </section>
      {!groupId ? <EmptyState message={t('attendance.chooseGroupPrompt')} /> : (
        <>
          <form onSubmit={submit}>
            <div className="table-wrap">
              <table><thead><tr><th>{t('attendance.student')}</th><th>{t('attendance.cardNumber')}</th><th>{t('attendance.violation')}</th><th>{t('attendance.note')}</th></tr></thead>
                <tbody>{students.map((student) => <tr key={student.id}>
                  <td className="student-name">{student.fullName}</td><td>{student.studentCardNumber}</td>
                  <td><select aria-label={t('attendance.violationFor', { name: student.fullName })} value={marks[student.id]?.categoryId || ''} onChange={(event) => setMarks((current) => ({ ...current, [student.id]: { ...current[student.id], categoryId: event.target.value } }))}><option value="">{t('attendance.present')}</option>{violations.map((item) => <option value={item.id} key={item.id}>{t(`attendance.${item.key}`)}</option>)}</select></td>
                  <td><input aria-label={t('attendance.note')} placeholder={t('attendance.optionalNote')} value={marks[student.id]?.note || ''} onChange={(event) => setMarks((current) => ({ ...current, [student.id]: { ...current[student.id], note: event.target.value } }))} /></td>
                </tr>)}
                  {!students.length && !studentsLoading && <tr><td colSpan="4" className="empty-cell">{t('attendance.noStudents')}</td></tr>}
                </tbody>
              </table>
              {studentsLoading && <p className="table-message">{t('attendance.loadingRoster')}</p>}
            </div>
            <div className="form-actions"><div>{error && <p className="form-error" role="alert">{error}</p>}{saved !== '' && <p className="form-success" role="status">{t('attendance.attendanceSaved', { count: saved })}</p>}</div><button className="button button-primary" disabled={pending || !students.length}>{!pending && <ClipboardCheck size={16} aria-hidden="true" />}{pending ? t('attendance.saving') : t('attendance.saveAttendance')}</button></div>
          </form>
          <section className="history-section"><div className="subheading"><div><p className="eyebrow">{t('attendance.groupRecord')}</p><h2>{t('attendance.recentAttendance')}</h2></div></div>
            {!history.length ? <p className="muted-line">{t('attendance.noRecords')}</p> : history.map((record) => <button key={record.id} className="history-row" onClick={() => loadHistory(record.id)}><span>{record.date}</span><span>{record.teacherName}</span><span>{t('attendance.violations', { count: record.details.filter((detail) => detail.violationCategoryId).length })}</span><ArrowUpRight className="arrow" size={17} aria-hidden="true" /></button>)}
          </section>
        </>
      )}
    </main>
  )
}

function EmptyState({ message }) {
  return <div className="empty-state"><ClipboardCheck size={28} aria-hidden="true" /><p>{message}</p></div>
}