import React from 'react';
import './Sidebar.scss'
import { Link, NavLink } from 'react-router-dom';

//Icons
import Logo1 from '../assets/icons/logo1.svg'
import TimeTable from '../assets/icons/timetable.svg'
import Home from '../assets/icons/Home.svg'
import Students from '../assets/icons/students.svg'
import Lessons from '../assets/icons/lessons.svg'
import ToDos from '../assets/icons/todos.svg'
import OpenSidebar from '../assets/icons/openSidebar.svg'

function Sidebar() {
  return (
    <div>
      <div className="sidebar">
        <button className="sidebar__button--open">
          <img src={OpenSidebar} alt="" />
        </button>
      <div className="sidebar__logo">
        <img src={Logo1} alt="" />
      </div>
      <nav className="sidebar__navigation">
        <ul className="sidebar__nav-list">

          <li className="sidebar__nav-el">
            <NavLink to="/" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <g clip-path="url(#clip0_305_760)">
              <path d="M13.9951 6.98633C13.9951 7.47852 13.6306 7.86406 13.2174 7.86406H12.4396L12.4566 12.2445C12.4566 12.3184 12.4517 12.3922 12.4444 12.466V12.9062C12.4444 13.5105 12.0094 14 11.4722 14H11.0833C11.0566 14 11.0299 14 11.0031 13.9973C10.9691 14 10.9351 14 10.901 14H10.1111H9.52778C8.99063 14 8.55556 13.5105 8.55556 12.9062V12.25V10.5C8.55556 10.016 8.20799 9.625 7.77778 9.625H6.22222C5.79201 9.625 5.44444 10.016 5.44444 10.5V12.25V12.9062C5.44444 13.5105 5.00938 14 4.47222 14H3.88889H3.11354C3.07708 14 3.04063 13.9973 3.00417 13.9945C2.975 13.9973 2.94583 14 2.91667 14H2.52778C1.99063 14 1.55556 13.5105 1.55556 12.9062V9.84375C1.55556 9.81914 1.55556 9.7918 1.55799 9.76719V7.86406H0.777778C0.340278 7.86406 0 7.48125 0 6.98633C0 6.74023 0.0729167 6.52148 0.243056 6.33008L6.475 0.21875C6.64514 0.0273438 6.83958 0 7.00972 0C7.17986 0 7.37431 0.0546875 7.52014 0.191406L13.7278 6.33008C13.9222 6.52148 14.0194 6.74023 13.9951 6.98633Z" fill="black"/>
              </g>
              <defs>
              <clipPath id="clip0_305_760">
              <rect width="14" height="14" fill="white"/>
              </clipPath>
              </defs>
              </svg>
              </div>
              <span className='sidebar__link-text'>Dashboard</span> 
            </NavLink>
          </li>

          <li className="sidebar__nav-el">     
            <NavLink to="/students" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <svg  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_305_766)">
            <path d="M7.7 3.5C7.7 5.4332 6.44656 7 4.9 7C3.35344 7 2.1 5.4332 2.1 3.5C2.1 1.5668 3.35344 0 4.9 0C6.44656 0 7.7 1.5668 7.7 3.5ZM0 13.1879C0 10.4945 1.74563 8.3125 3.90031 8.3125H5.89969C8.05437 8.3125 9.8 10.4945 9.8 13.1879C9.8 13.6363 9.50906 14 9.15031 14H0.649688C0.290938 14 0 13.6363 0 13.1879ZM13.3284 14H10.3119C10.43 13.743 10.5 13.4449 10.5 13.125V12.9062C10.5 11.2465 9.90719 9.75625 8.97313 8.75547C9.02563 8.75274 9.07594 8.75 9.12844 8.75H10.4716C12.4206 8.75 14 10.7242 14 13.1605C14 13.6254 13.6981 14 13.3284 14ZM9.45 7C8.77187 7 8.15938 6.65547 7.71531 6.10039C8.14625 5.37305 8.4 4.47344 8.4 3.5C8.4 2.76719 8.25562 2.07539 7.99969 1.46836C8.40656 1.09648 8.9075 0.875 9.45 0.875C10.8041 0.875 11.9 2.24492 11.9 3.9375C11.9 5.63008 10.8041 7 9.45 7Z" fill="black"/>
            </g>
            <defs>
            <clipPath id="clip0_305_766">
            <rect width="14" height="14" fill="white"/>
            </clipPath>
            </defs>
            </svg>
              </div>
             
              <span>Schüler:innen</span>
            </NavLink>
          </li>

          <li className="sidebar__nav-el">
            <NavLink to="/timetable" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <svg  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_305_766)">
            <path d="M7.7 3.5C7.7 5.4332 6.44656 7 4.9 7C3.35344 7 2.1 5.4332 2.1 3.5C2.1 1.5668 3.35344 0 4.9 0C6.44656 0 7.7 1.5668 7.7 3.5ZM0 13.1879C0 10.4945 1.74563 8.3125 3.90031 8.3125H5.89969C8.05437 8.3125 9.8 10.4945 9.8 13.1879C9.8 13.6363 9.50906 14 9.15031 14H0.649688C0.290938 14 0 13.6363 0 13.1879ZM13.3284 14H10.3119C10.43 13.743 10.5 13.4449 10.5 13.125V12.9062C10.5 11.2465 9.90719 9.75625 8.97313 8.75547C9.02563 8.75274 9.07594 8.75 9.12844 8.75H10.4716C12.4206 8.75 14 10.7242 14 13.1605C14 13.6254 13.6981 14 13.3284 14ZM9.45 7C8.77187 7 8.15938 6.65547 7.71531 6.10039C8.14625 5.37305 8.4 4.47344 8.4 3.5C8.4 2.76719 8.25562 2.07539 7.99969 1.46836C8.40656 1.09648 8.9075 0.875 9.45 0.875C10.8041 0.875 11.9 2.24492 11.9 3.9375C11.9 5.63008 10.8041 7 9.45 7Z" fill="black"/>
            </g>
            <defs>
            <clipPath id="clip0_305_766">
            <rect width="14" height="14" fill="white"/>
            </clipPath>
            </defs>
            </svg>
              </div>
              
            <span>Stundenplan</span>
            </NavLink>
          </li>

          <li className="sidebar__nav-el">
            <NavLink to="/lessons" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <svg  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_305_780)">
              <path d="M5.8 3.33333V8L7.55 7L9.3 8V3.33333H5.8ZM13.5 16C12.5317 16 11.7064 15.6751 11.0241 15.0253C10.3414 14.3751 10 13.5889 10 12.6667C10 11.7444 10.3414 10.9582 11.0241 10.308C11.7064 9.65822 12.5317 9.33333 13.5 9.33333C14.4683 9.33333 15.2939 9.65822 15.9766 10.308C16.6589 10.9582 17 11.7444 17 12.6667C17 13.5889 16.6589 14.3751 15.9766 15.0253C15.2939 15.6751 14.4683 16 13.5 16ZM12.625 14.3333L15.425 12.6667L12.625 11V14.3333ZM8.6 12.6667C8.6 13.1444 8.67887 13.6082 8.8366 14.058C8.99387 14.5082 9.20667 14.9333 9.475 15.3333H4.4C4.015 15.3333 3.6853 15.2029 3.4109 14.942C3.13697 14.6807 3 14.3667 3 14V3.33333C3 2.96667 3.13697 2.65267 3.4109 2.39133C3.6853 2.13044 4.015 2 4.4 2H12.8C13.185 2 13.5147 2.13044 13.7891 2.39133C14.063 2.65267 14.2 2.96667 14.2 3.33333V8.03333C14.0833 8.02222 13.9667 8.01378 13.85 8.008C13.7333 8.00267 13.6167 8 13.5 8C12.135 8 10.9772 8.45267 10.0266 9.358C9.07553 10.2638 8.6 11.3667 8.6 12.6667Z" fill="black"/>
              </g>
              <defs>
              <clipPath id="clip0_305_780">
              <rect width="14" height="14" fill="white"/>
              </clipPath>
              </defs>
              </svg>
              </div>
              <span>Unterrichten</span>
            </NavLink>
          </li>

          <li className="sidebar__nav-el">
            <NavLink to="/todos" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <svg  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_305_787)">
              <path d="M2.33333 0C1.04635 0 0 0.784766 0 1.75V12.25C0 13.2152 1.04635 14 2.33333 14H11.6667C12.9536 14 14 13.2152 14 12.25V4.375H9.33333C8.68802 4.375 8.16667 3.98398 8.16667 3.5V0H2.33333ZM9.33333 0V3.5H14L9.33333 0ZM4.08333 7H9.91667C10.2375 7 10.5 7.19687 10.5 7.4375C10.5 7.67813 10.2375 7.875 9.91667 7.875H4.08333C3.7625 7.875 3.5 7.67813 3.5 7.4375C3.5 7.19687 3.7625 7 4.08333 7ZM4.08333 8.75H9.91667C10.2375 8.75 10.5 8.94687 10.5 9.1875C10.5 9.42813 10.2375 9.625 9.91667 9.625H4.08333C3.7625 9.625 3.5 9.42813 3.5 9.1875C3.5 8.94687 3.7625 8.75 4.08333 8.75ZM4.08333 10.5H9.91667C10.2375 10.5 10.5 10.6969 10.5 10.9375C10.5 11.1781 10.2375 11.375 9.91667 11.375H4.08333C3.7625 11.375 3.5 11.1781 3.5 10.9375C3.5 10.6969 3.7625 10.5 4.08333 10.5Z" fill="black"/>
              </g>
              <defs>
              <clipPath id="clip0_305_787">
              <rect width="14" height="14" fill="white"/>
              </clipPath>
              </defs>
              </svg>
              </div>
              
              <span>To Dos</span>
            </NavLink>
          </li>

        </ul>
      </nav>
      </div>
      </div>
  
  );
}

export default Sidebar;