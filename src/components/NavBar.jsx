import React from 'react'
import './NavBar.css'
// import {Link} from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className='navbar'>
      <div className="navbar-brand">
        <a className="brand-link">Brand</a>
      </div>
      <div className="navlinks">
        <li className="nav-item">
          <a className="nav-link">Groups</a>
        </li>
        <li className="nav-item">
          <a className="nav-link">Notes</a>
        </li>
        <li className="nav-item">
          <a className="nav-link">Logout</a>
        </li>
      </div>
    </nav>
  )
}

export default NavBar
