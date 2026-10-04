import { useState } from 'react'
import { apiPost, apiRequest } from '../api'
import { useApiResource } from '../hooks/useApiResource'
import { useAsyncAction } from '../hooks/useAsyncAction'

const roles = [{ id: 1, name: 'Administrator' }, { id: 2, name: 'Dean' }, { id: 3, name: 'Deputy dean' }]

export default function AdminPage() {
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
    if (!window.confirm(`Delete the account for ${user.fullName}?`)) return
    const result = await run(() => apiRequest(`/Users/${user.id}`, { method: 'DELETE' }))
    if (result === null) refreshUsers()
  }

  return (
    <main className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">PORTAL CONTROL / ADMINISTRATOR</p><h1>Administration</h1></div><span className="section-count">{users.filter((user) => !user.roleId).length} awaiting approval</span></section>
      {error && <p className="form-error admin-error" role="alert">{error}</p>}
      <section className="admin-section"><div className="subheading"><div><p className="eyebrow">ACCESS CONTROL</p><h2>User accounts</h2></div></div>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Faculty</th><th>Role</th><th>Account</th><th /></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td className="student-name">{user.fullName}</td><td>{faculties.find((faculty) => faculty.id === user.facultyId)?.name || `Faculty ${user.facultyId}`}</td><td><select aria-label={`Role for ${user.fullName}`} value={user.roleId || ''} onChange={(event) => event.target.value && assignRole(user.id, event.target.value)}><option value="">Unassigned</option>{roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}</select></td><td><span className={`status-tag ${user.roleId ? 'status-active' : 'status-pending'}`}>{user.roleId ? 'Active' : 'Pending'}</span></td><td><button className="text-button danger-text" onClick={() => deleteUser(user)}>Delete</button></td></tr>)}{!users.length && <tr><td colSpan="5" className="empty-cell">No user accounts found.</td></tr>}</tbody></table></div>
      </section>
      <section className="admin-section"><div className="subheading"><div><p className="eyebrow">ACADEMIC STRUCTURE</p><h2>Directory setup</h2></div></div>
        <div className="directory-grid">
          <form className="directory-form" onSubmit={(event) => create(event, '/Faculties', { Name: facultyName.trim() }, () => setFacultyName(''))}><span className="form-index">01 / FACULTIES</span><label>Faculty name<input value={facultyName} onChange={(event) => setFacultyName(event.target.value)} required /></label><button className="button button-secondary" disabled={pending}>Add faculty</button><small>{faculties.length} records</small></form>
          <form className="directory-form" onSubmit={(event) => create(event, '/Courses', { CourseNumber: courseNumber.trim(), FacultyId: Number(courseFaculty) }, () => { setCourseNumber(''); setCourseFaculty('') })}><span className="form-index">02 / COURSES</span><label>Course number<input value={courseNumber} onChange={(event) => setCourseNumber(event.target.value)} required /></label><label>Faculty<select value={courseFaculty} onChange={(event) => setCourseFaculty(event.target.value)} required><option value="">Choose faculty</option>{faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.name}</option>)}</select></label><button className="button button-secondary" disabled={pending}>Add course</button><small>{courses.length} records</small></form>
          <form className="directory-form" onSubmit={(event) => create(event, '/Groups', { GroupNumber: Number(groupNumber), CourseId: Number(groupCourse) }, () => { setGroupNumber(''); setGroupCourse('') })}><span className="form-index">03 / GROUPS</span><label>Group number<input type="number" value={groupNumber} onChange={(event) => setGroupNumber(event.target.value)} required /></label><label>Course<select value={groupCourse} onChange={(event) => setGroupCourse(event.target.value)} required><option value="">Choose course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.courseNumber}</option>)}</select></label><button className="button button-secondary" disabled={pending}>Add group</button><small>{groups.length} records</small></form>
        </div>
      </section>
    </main>
  )
}