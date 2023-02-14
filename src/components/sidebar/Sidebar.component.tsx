import React, { useState } from 'react';
import './Sidebar.scss'
import { Link, NavLink } from 'react-router-dom';
import { IoCompassOutline } from "react-icons/io5";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoSchoolOutline } from "react-icons/io5";
import { IoListOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";





//Icons
import Logo1 from '../../assets/icons/logo1.svg'

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <div>
      <div className={`sidebar${sidebarOpen? ' open': ''}`}>
        <button className="sidebar__button--toggle" onClick={toggleSidebar}>
          <IoChevronForwardOutline className='chevron'/>
        </button>
      <div className="sidebar__logo">
        <img src={Logo1} alt="" />
      </div>
      <nav className="sidebar__navigation">
        <ul className="sidebar__nav-list">

          <li className="sidebar__nav-el">
            <NavLink to="/" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                 <IoCompassOutline className='icon'/>
              </div>
              <span className='sidebar__link-text'>Dashboard</span> 
            </NavLink>
          </li>

          <li className="sidebar__nav-el">     
            <NavLink to="/students" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
               <IoPeopleCircleOutline className='icon'/>
              </div>
             
              <span className='sidebar__link-text'>Schüler:innen</span>
            </NavLink>
          </li>

          <li className="sidebar__nav-el">
            <NavLink to="/timetable" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
               <IoCalendarClearOutline className='icon'/>
              </div>
              
            <span className='sidebar__link-text'>Stundenplan</span>
            </NavLink>
          </li>

          <li className="sidebar__nav-el">
            <NavLink to="/lessons" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <IoSchoolOutline className='icon'/>
              </div>
              <span className='sidebar__link-text'>Unterrichten</span>
            </NavLink>
          </li>

          <li className="sidebar__nav-el">
            <NavLink to="/todos" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <IoListOutline className='icon'/>
              </div>
              
              <span className='sidebar__link-text'>To Dos</span>
            </NavLink>
          </li>

        </ul>
      </nav>
      </div>
      </div>
  
  );
}

export default Sidebar;