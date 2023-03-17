import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../button/Button.component'
import { IoPersonAddOutline } from 'react-icons/io5'
import { IoArchiveOutline } from 'react-icons/io5'

import './noActiveStudent.style.scss'

function NoActiveStudent({ handler }) {
  return (
    <>
      <h3 className="heading-3">Keine aktiven Schüler:innen in der Liste</h3>
      <div className="container--buttons">
        <Button
          type="button"
          btnStyle="primary"
          label="Neue Schüler:in erfassen"
          handler={handler}
          icon={<IoPersonAddOutline />}
        />

        <NavLink to="/students/archive">
          <Button
            type="button"
            btnStyle="primary"
            label="Aus Archiv wiederherstellen"
            icon={<IoArchiveOutline />}
          />
        </NavLink>
      </div>
    </>
  )
}

export default NoActiveStudent
