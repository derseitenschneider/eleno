import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "./pages/error/error";

import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/students/Students';
import StudentList from './pages/students/studentList/StudentList';
import StudentsArchive from './pages/students/studentsArchive/StudentsArchive';
import CreateStudent from './pages/students/createStudent/CreateStudent';
import Timetable from './pages/timetable/Timetable';
import Lessons from './pages/lessons/Lessons';
import ToDos from './pages/todos/ToDos';
import Application from './Application';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Application/>,
    errorElement: <ErrorPage />,
    children: [
      {
        index:true,
        element: <Dashboard/>
      },
      {
        path: 'students',
        element: <Students/>,
        children: [
          {
            index: true,
            element: <StudentList/>
          },         
          {
            path: 'archive',
            element: <StudentsArchive/>
          }
        ]
      },
      {
        path: 'timetable',
        element: <Timetable/>
      },
       {
        path: 'lessons',
        element: <Lessons/>
      },
       {
        path: 'todos',
        element: <ToDos/>
      },
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
