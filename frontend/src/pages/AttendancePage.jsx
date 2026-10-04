import { useState } from 'react'
import { apiPost } from '../api'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'

const violations = [
  { id: 1, name: 'Absent' },
  { id: 2, name: 'No student card' },
  { id: 3, name: 'Uniform issue' },
]

export default function AttendancePage({ user }) {
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
      setSaved(`Attendance saved for ${students.length} students.`)
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
      <section className="page-heading"><div><p className="eyebrow">ACADEMIC RECORDS / DAILY CHECK</p><h1>Attendance</h1></div><span className="section-count">{groups.length} groups</span></section>
      <section className="toolbar-row">
        <label className="compact-field">Study group<select value={groupId} onChange={changeGroup}><option value="">Select a group</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.groupNumber} · Course {group.courseNumber}</option>)}</select></label>
        <label className="compact-field">Record date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
      </section>
      {!groupId ? <EmptyState message="Choose a study group to load its roster." /> : (
        <>
          <form onSubmit={submit}>
            <div className="table-wrap">
              <table><thead><tr><th>Student</th><th>Card no.</th><th>Violation</th><th>Note</th></tr></thead>
                <tbody>{students.map((student) => <tr key={student.id}>
                  <td className="student-name">{student.fullName}</td><td>{student.studentCardNumber}</td>
                  <td><select aria-label={`Violation for ${student.fullName}`} value={marks[student.id]?.categoryId || ''} onChange={(event) => setMarks((current) => ({ ...current, [student.id]: { ...current[student.id], categoryId: event.target.value } }))}><option value="">Present</option>{violations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></td>
                  <td><input aria-label={`Note for ${student.fullName}`} placeholder="Optional note" value={marks[student.id]?.note || ''} onChange={(event) => setMarks((current) => ({ ...current, [student.id]: { ...current[student.id], note: event.target.value } }))} /></td>
                </tr>)}
                  {!students.length && !studentsLoading && <tr><td colSpan="4" className="empty-cell">No students are assigned to this group yet.</td></tr>}
                </tbody>
              </table>
              {studentsLoading && <p className="table-message">Loading roster…</p>}
            </div>
            <div className="form-actions"><div>{error && <p className="form-error" role="alert">{error}</p>}{saved && <p className="form-success" role="status">{saved}</p>}</div><button className="button button-primary" disabled={pending || !students.length}>{pending ? 'Saving…' : 'Save attendance'}</button></div>
          </form>
          <section className="history-section"><div className="subheading"><div><p className="eyebrow">GROUP RECORD</p><h2>Recent attendance</h2></div></div>
            {!history.length ? <p className="muted-line">No records for this group yet.</p> : history.map((record) => <button key={record.id} className="history-row" onClick={() => loadHistory(record.id)}><span>{record.date}</span><span>{record.teacherName}</span><span>{record.details.filter((detail) => detail.violationCategoryId).length} violations</span><span className="arrow">↗</span></button>)}
          </section>
        </>
      )}
    </main>
  )
}

function EmptyState({ message }) {
  return <div className="empty-state"><span className="empty-mark">—</span><p>{message}</p></div>
}