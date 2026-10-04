import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiPost, apiRequest } from '../api'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { BookOpen, Building2, Plus, ShieldCheck, Trash2, Users } from 'lucide-react'

const roles = [{ id: 1, key: 'administrator' }, { id: 2, key: 'dean' }, { id: 3, key: 'deputyDean' }]

export default function AdminPage() {
  const { t } = useTranslation()
  const { data: users, refresh: refreshUsers } = useApiResource('/Users')
  const { data: faculties, refresh: refreshFaculties } = useApiResource('/Faculties')
  const { data: courses, refresh: refreshCourses } = useApiResource('/Courses')
  const { data: groups, refresh: refreshGroups } = useApiResource('/Groups')
  const [facultyName, setFacultyName] = useState('')
  const [courseNumber, setCourseNumber] = useState('')
  const [courseFaculty, setCourseFaculty] = useState('')
  const [groupNumber, setGroupNumber] = useState('')
  const [groupCourse, setGroupCourse] = useState('')
  const { pending, error, run } = useAsyncAction()

  async function create(event, path, body, reset) {
    event.preventDefault()
    const result = await run(() => apiPost(path, body))
    if (result) {
      reset()
      if (path === '/Faculties') refreshFaculties()
      if (path === '/Courses') refreshCourses()
      if (path === '/Groups') refreshGroups()
    }
  }

  async function assignRole(userId, roleId) {
    const result = await run(() => apiPost('/Users/assign-role', { UserId: userId, RoleId: Number(roleId) }))
    if (result !== null) refreshUsers()
  }

  async function deleteUser(user) {
    if (!window.confirm(t('admin.deleteAccountConfirm', { name: user.fullName }))) return
    const result = await run(() => apiRequest(`/Users/${user.id}`, { method: 'DELETE' }))
    if (result === null) refreshUsers()
  }

  return (
    <main className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">{t('admin.eyebrow')}</p><h1><ShieldCheck size={30} aria-hidden="true" />{t('admin.heading')}</h1></div><span className="section-count">{t('admin.awaitingApproval', { count: users.filter((user) => !user.roleId).length })}</span></section>
      {error && <p className="form-error admin-error" role="alert">{error}</p>}
      <section className="admin-section"><div className="subheading"><div><p className="eyebrow">{t('admin.accessControl')}</p><h2><Users size={21} aria-hidden="true" />{t('admin.userAccounts')}</h2></div></div>
        <div className="table-wrap"><table><thead><tr><th>{t('admin.name')}</th><th>{t('admin.faculty')}</th><th>{t('admin.role')}</th><th>{t('admin.account')}</th><th>{t('admin.actions')}</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td className="student-name">{user.fullName}</td><td>{faculties.find((faculty) => faculty.id === user.facultyId)?.name || `${t('admin.faculty')} ${user.facultyId}`}</td><td><select aria-label={`${t('admin.role')} — ${user.fullName}`} value={user.roleId || ''} onChange={(event) => event.target.value && assignRole(user.id, event.target.value)}><option value="">{t('admin.unassigned')}</option>{roles.map((role) => <option value={role.id} key={role.id}>{t(`roles.${role.key}`)}</option>)}</select></td><td><span className={`status-tag ${user.roleId ? 'status-active' : 'status-pending'}`}>{user.roleId ? t('admin.active') : t('admin.pending')}</span></td><td><button className="text-button danger-text" onClick={() => deleteUser(user)}><Trash2 size={14} aria-hidden="true" />{t('admin.delete')}</button></td></tr>)}{!users.length && <tr><td colSpan="5" className="empty-cell">{t('admin.noAccounts')}</td></tr>}</tbody></table></div>
      </section>
      <section className="admin-section"><div className="subheading"><div><p className="eyebrow">{t('admin.academicStructure')}</p><h2><Building2 size={21} aria-hidden="true" />{t('admin.directorySetup')}</h2></div></div>
        <div className="directory-grid">
          <form className="directory-form" onSubmit={(event) => create(event, '/Faculties', { Name: facultyName.trim() }, () => setFacultyName(''))}><span className="form-index"><Building2 size={15} aria-hidden="true" />01 / {t('admin.faculties')}</span><label>{t('admin.facultyName')}<input value={facultyName} onChange={(event) => setFacultyName(event.target.value)} required /></label><button className="button button-secondary" disabled={pending}><Plus size={16} aria-hidden="true" />{t('admin.addFaculty')}</button><small>{t('admin.records', { count: faculties.length })}</small></form>
          <form className="directory-form" onSubmit={(event) => create(event, '/Courses', { CourseNumber: courseNumber.trim(), FacultyId: Number(courseFaculty) }, () => { setCourseNumber(''); setCourseFaculty('') })}><span className="form-index"><BookOpen size={15} aria-hidden="true" />02 / {t('admin.courses')}</span><label>{t('admin.courseNumber')}<input value={courseNumber} onChange={(event) => setCourseNumber(event.target.value)} required /></label><label>{t('admin.faculty')}<select value={courseFaculty} onChange={(event) => setCourseFaculty(event.target.value)} required><option value="">{t('admin.chooseFaculty')}</option>{faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.name}</option>)}</select></label><button className="button button-secondary" disabled={pending}><Plus size={16} aria-hidden="true" />{t('admin.addCourse')}</button><small>{t('admin.records', { count: courses.length })}</small></form>
          <form className="directory-form" onSubmit={(event) => create(event, '/Groups', { GroupNumber: Number(groupNumber), CourseId: Number(groupCourse) }, () => { setGroupNumber(''); setGroupCourse('') })}><span className="form-index"><Users size={15} aria-hidden="true" />03 / {t('admin.groups')}</span><label>{t('admin.groupNumber')}<input type="number" value={groupNumber} onChange={(event) => setGroupNumber(event.target.value)} required /></label><label>{t('attendance.course')}<select value={groupCourse} onChange={(event) => setGroupCourse(event.target.value)} required><option value="">{t('admin.chooseCourse')}</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.courseNumber}</option>)}</select></label><button className="button button-secondary" disabled={pending}><Plus size={16} aria-hidden="true" />{t('admin.addGroup')}</button><small>{t('admin.records', { count: groups.length })}</small></form>
        </div>
      </section>
    </main>
  )
}