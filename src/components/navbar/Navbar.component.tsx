import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './navbar.styles.css'

interface IProps {
  navLinks: {
    path: string,
    label: string,
    key: number
  }[]
}

function Navbar({navLinks}:IProps) {

  return (
    <div className='navbar'>
      <ul className='navlist'>
         {navLinks.map(link => 
         <li key={link.key} className='nav-item'>
          <NavLink 
          to={link.path}
          className='navlink'
          >{link.label}
          </NavLink>
         </li>)}
      </ul>
    </div>
  );
}

export default Navbar;