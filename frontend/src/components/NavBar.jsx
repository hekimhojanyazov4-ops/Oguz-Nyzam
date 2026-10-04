const NavBar = ({ user, activePage, onNavigate, onLogout }) => {
  const links = [
    ['overview', 'Overview'],
    ['attendance', 'Attendance'],
    ['students', 'Students'],
    ...(user.roleId === 1 ? [['admin', 'Admin']] : []),
  ]

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={() => onNavigate('overview')} aria-label="Oguz Nyzam overview">
        <span className="brand-icon">ON</span><span className="brand-name">Oguz Nyzam<small>ACADEMIC PORTAL</small></span>
      </button>
      <div className="navlinks" aria-label="Main navigation">
        {links.map(([key, label]) => <button key={key} className={`nav-link ${activePage === key ? 'is-active' : ''}`} aria-current={activePage === key ? 'page' : undefined} onClick={() => onNavigate(key)}>{label}</button>)}
      </div>
      <div className="nav-user"><span className="user-name">{user.fullName}<small>{user.roleId === 1 ? 'ADMINISTRATOR' : user.roleId ? 'FACULTY STAFF' : 'MEMBER'}</small></span><button className="logout-button" onClick={onLogout} title="Sign out" aria-label="Sign out">↗</button></div>
    </nav>
  )
}

export default NavBar
