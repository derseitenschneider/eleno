import React from 'react'

import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/error/error'

import Dashboard from '../pages/dashboard/Dashboard'
import Students from '../pages/students/Students'
import StudentsArchive from '../pages/students/studentsArchive/StudentsArchive'
import Timetable from '../pages/timetable/Timetable.component'
import Lessons from '../pages/lessons/Lessons'
import Application from '../Application'
import Settings from '../pages/settings/Settings'
import StudentsActive from '../pages/students/studentsActive/StudentsActive'
import ToDos from '../pages/todos/Todos.page'
import TodosOpen from '../pages/todos/TodosOpen.page'
import TodosCompleted from '../pages/todos/TodosCompleted.page'
import Account from '../pages/settings/account/Account'
import TermsAndConditionsPage from '../pages/terms/TermsAndConditionsPage'
import PrivacyPolicyPage from '../pages/privacy/PrivacyPolicyPage'
import Manual from '../pages/manual/manual.component'
import Welcome from '../components/manual/content-manual/welcome/Welcome.component'
import CreateAccount from '../components/manual/content-manual/create-account/CreateAccount.component'
import QuickStart from '../components/manual/content-manual/quick-start/QuickStart.component'
import DashboardManual from '../components/manual/content-manual/dashboard/Dashboard.component'
import Teaching from '../components/manual/content-manual/teaching/Teaching.component'
import StudentsManual from '../components/manual/content-manual/students/StudentsManual.component'
import ScheduleManual from '../components/manual/content-manual/schedule/ScheduleManual.component'
import TodosManual from '../components/manual/content-manual/todos/TodosManual.component'
import SettingsManual from '../components/manual/content-manual/settings/SettingsManual.component'
import ScrollToTop from '../hooks/ScrollToTop'

export const mainRouter = createBrowserRouter(
  [
    {
      path: `/`,
      element: <Application />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: 'students',
          element: <Students />,
          children: [
            {
              index: true,
              path: '',
              element: <StudentsActive />,
            },
            {
              path: `archive`,
              element: <StudentsArchive />,
            },
          ],
        },
        {
          path: `timetable`,
          element: <Timetable />,
        },
        {
          path: 'lessons',
          element: <Lessons />,
        },
        {
          path: `todos`,
          element: <ToDos />,
          children: [
            { index: true, path: '', element: <TodosOpen /> },
            { path: 'completed', element: <TodosCompleted /> },
          ],
        },
        {
          path: `settings`,
          element: <Settings />,
          children: [
            {
              index: true,
              path: '',
              element: <Account />,
            },
          ],
        },
        {
          path: `terms`,
          element: <TermsAndConditionsPage />,
        },
        {
          path: `privacy`,
          element: <PrivacyPolicyPage />,
        },
      ],
    },
    {
      path: '/manual',
      element: <Manual />,
      children: [
        { index: true, element: <Welcome /> },
        { path: 'create-account', element: <CreateAccount /> },
        { path: 'quick-start', element: <QuickStart /> },
        { path: 'dashboard', element: <DashboardManual /> },
        { path: 'teaching', element: <Teaching /> },
        { path: 'students', element: <StudentsManual /> },
        { path: 'schedule', element: <ScheduleManual /> },
        { path: 'todos', element: <TodosManual /> },
        { path: 'settings', element: <SettingsManual /> },
      ],
    },
  ],
  {
    basename: '/',
  }
)
