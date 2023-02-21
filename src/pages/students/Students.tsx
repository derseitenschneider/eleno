import './students.style.scss'

import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStudents } from '../../contexts/StudentContext';
import Navbar from '../../layouts/navbar/navbar.component';

const navLinks = [
 
  {path: 'archive', label: 'Archiv', key: 2},
]

export default function Students() {
 const {students, setStudents}  = useStudents()
  return (
    <div>
       <Navbar navLinks={navLinks}/>
        <Outlet context={{students, setStudents}}/>
    </div>
  );
}

