import { useTranslation } from 'react-i18next'
import { BookOpen, ClipboardCheck, GraduationCap, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'
import LanguageSelector from './LanguageSelector'

const NavBar = ({ user, activePage, onNavigate, onLogout }) => {
  const { t } = useTranslation()

  const links = [
    ['overview', t('nav.overview'), LayoutDashboard],
    ['attendance', t('nav.attendance'), ClipboardCheck],
    ['students', t('nav.students'), GraduationCap],
    ...(user.roleId === 1 ? [['admin', t('nav.admin'), ShieldCheck]] : []),
  ]

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={() => onNavigate('overview')} aria-label={`${t('brand.title')} — ${t('nav.overview')}`}>
        <span className="brand-icon"><BookOpen size={19} aria-hidden="true" /></span><span className="brand-name">{t('brand.title')}<small>{t('brand.subtitle')}</small></span>
      </button>
      <div className="navlinks" aria-label={t('nav.mainNavigation')}>
        {links.map(([key, label, Icon]) => <button key={key} className={`nav-link ${activePage === key ? 'is-active' : ''}`} aria-current={activePage === key ? 'page' : undefined} onClick={() => onNavigate(key)}><Icon size={16} aria-hidden="true" />{label}</button>)}
      </div>
      <div className="nav-user">
        <span className="user-name">{user.fullName}<small>{user.roleId === 1 ? t('roles.administrator') : user.roleId === 2 ? t('roles.dean') : user.roleId === 3 ? t('roles.deputyDean') : t('roles.member')}</small></span>
        <LanguageSelector />
        <button className="logout-button" onClick={onLogout} title={t('nav.signOut')} aria-label={t('nav.signOut')}><LogOut size={17} aria-hidden="true" /></button>
      </div>
    </nav>
  )
}

export default NavBar
