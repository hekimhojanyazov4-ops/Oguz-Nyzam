import { useState } from 'react'
import { apiPost, apiRequest } from '../api'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'

const blankForm = { fullName: '', studentCardNumber: '', groupId: '' }

export default function StudentsPage() {
  const { data: groups } = useApiResource('/Groups')
  const [groupId, setGroupId] = useState('')
  const { data: students, loading, error: loadError, refresh } = useApiResource(groupId ? `/Students/group/${groupId}` : null)
  const [form, setForm] = useState(blankForm)
  const [editingId, setEditingId] = useState('')
  const { pending, error, run } = useAsyncAction()

  function editStudent(student) {
    setEditingId(student.id)
    setForm({ fullName: student.fullName, studentCardNumber: String(student.studentCardNumber), groupId: String(student.groupId) })
    setGroupId(String(student.groupId))
  }

  function cancelEdit() {
    setEditingId('')
    setForm(blankForm)
  }

  async function submit(event) {
    event.preventDefault()
    const payload = { FullName: form.fullName.trim(), StudentCardNumber: Number(form.studentCardNumber), GroupId: Number(form.groupId) }
    const result = await run(() => editingId
      ? apiRequest(`/Students/${editingId}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }).then(() => true)
      : apiPost('/Students', payload))
    if (result !== null) {
      setGroupId(String(payload.GroupId))
      cancelEdit()
      refresh()
    }
  }

  async function removeStudent(student) {
    if (!window.confirm(`Delete ${student.fullName}?`)) return
    const result = await run(() => apiRequest(`/Students/${student.id}`, { method: 'DELETE' }))
    if (result === null) refresh()
  }

  return (
    <main className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">ACADEMIC RECORDS / ROSTER</p><h1>Students</h1></div><span className="section-count">{students.length} students</span></section>
      <section className="student-tools">
        <label className="compact-field">Study group<select value={groupId} onChange={(event) => setGroupId(event.target.value)}><option value="">Select a group</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.groupNumber} · Course {group.courseNumber}</option>)}</select></label>
        <form className="student-form" onSubmit={submit}>
          <div className="subheading"><div><p className="eyebrow">{editingId ? 'UPDATE RECORD' : 'NEW RECORD'}</p><h2>{editingId ? 'Edit student' : 'Add student'}</h2></div>{editingId && <button type="button" className="text-button" onClick={cancelEdit}>Cancel</button>}</div>
          <label>Full name<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
          <div className="inline-fields"><label>Student card number<input type="number" value={form.studentCardNumber} onChange={(event) => setForm({ ...form, studentCardNumber: event.target.value })} required /></label><label>Group<select value={form.groupId} onChange={(event) => setForm({ ...form, groupId: event.target.value })} required><option value="">Choose</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.groupNumber}</option>)}</select></label></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={pending}>{pending ? 'Saving…' : editingId ? 'Update student' : 'Add student'}</button>
        </form>
      </section>
      <section className="directory-section"><div className="subheading"><div><p className="eyebrow">GROUP ROSTER</p><h2>{groupId ? `Group ${groups.find((group) => String(group.id) === groupId)?.groupNumber || ''}` : 'Choose a group'}</h2></div></div>
        {loadError && <p className="form-error" role="alert">{loadError}</p>}
        {loading && <p className="muted-line">Loading students…</p>}
        {!groupId && !loading && <p className="muted-line">Select a group to view its students.</p>}
        {groupId && !loading && <div className="table-wrap"><table><thead><tr><th>Full name</th><th>Card number</th><th>Actions</th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td className="student-name">{student.fullName}</td><td>{student.studentCardNumber}</td><td className="row-actions"><button className="text-button" onClick={() => editStudent(student)}>Edit</button><button className="text-button danger-text" onClick={() => removeStudent(student)}>Delete</button></td></tr>)}{!students.length && <tr><td className="empty-cell" colSpan="3">No students in this group.</td></tr>}</tbody></table></div>}
      </section>
    </main>
  )
}