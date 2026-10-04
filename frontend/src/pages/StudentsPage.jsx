import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiPost, apiRequest } from '../api'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { GraduationCap, Pencil, Plus, Trash2, X } from 'lucide-react'

const blankForm = { fullName: '', studentCardNumber: '', groupId: '' }

export default function StudentsPage() {
  const { t } = useTranslation()
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
    if (!window.confirm(t('students.deleteConfirm', { name: student.fullName }))) return
    const result = await run(() => apiRequest(`/Students/${student.id}`, { method: 'DELETE' }))
    if (result === null) refresh()
  }

  return (
    <main className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">{t('students.eyebrow')}</p><h1><GraduationCap size={30} aria-hidden="true" />{t('students.heading')}</h1></div><span className="section-count">{t('students.studentCount', { count: students.length })}</span></section>
      <section className="student-tools">
        <label className="compact-field">{t('students.studyGroup')}<select value={groupId} onChange={(event) => setGroupId(event.target.value)}><option value="">{t('students.selectGroup')}</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.groupNumber} · {t('students.course')} {group.courseNumber}</option>)}</select></label>
        <form className="student-form" onSubmit={submit}>
          <div className="subheading"><div><p className="eyebrow">{editingId ? t('students.updateRecord') : t('students.newRecord')}</p><h2>{editingId ? t('students.editStudent') : t('students.addStudent')}</h2></div>{editingId && <button type="button" className="text-button" onClick={cancelEdit}><X size={15} aria-hidden="true" />{t('students.cancel')}</button>}</div>
          <label>{t('students.fullName')}<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
          <div className="inline-fields"><label>{t('students.studentCardNumber')}<input type="number" value={form.studentCardNumber} onChange={(event) => setForm({ ...form, studentCardNumber: event.target.value })} required /></label><label>{t('students.group')}<select value={form.groupId} onChange={(event) => setForm({ ...form, groupId: event.target.value })} required><option value="">{t('students.choose')}</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.groupNumber}</option>)}</select></label></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={pending}>{!pending && (editingId ? <Pencil size={16} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />)}{pending ? t('common.saving') : editingId ? t('students.updateButton') : t('students.addButton')}</button>
        </form>
      </section>
      <section className="directory-section"><div className="subheading"><div><p className="eyebrow">{t('students.roster')}</p><h2>{groupId ? t('students.groupTitle', { number: groups.find((group) => String(group.id) === groupId)?.groupNumber || '' }) : t('students.chooseGroup')}</h2></div></div>
        {loadError && <p className="form-error" role="alert">{loadError}</p>}
        {loading && <p className="muted-line">{t('students.loading')}</p>}
        {!groupId && !loading && <p className="muted-line">{t('students.selectGroupPrompt')}</p>}
        {groupId && !loading && <div className="table-wrap"><table><thead><tr><th>{t('students.fullName')}</th><th>{t('students.studentCardNumber')}</th><th>{t('students.actions')}</th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td className="student-name">{student.fullName}</td><td>{student.studentCardNumber}</td><td className="row-actions"><button className="text-button" onClick={() => editStudent(student)}><Pencil size={14} aria-hidden="true" />{t('students.edit')}</button><button className="text-button danger-text" onClick={() => removeStudent(student)}><Trash2 size={14} aria-hidden="true" />{t('students.delete')}</button></td></tr>)}{!students.length && <tr><td className="empty-cell" colSpan="3">{t('students.noStudents')}</td></tr>}</tbody></table></div>}
      </section>
    </main>
  )
}