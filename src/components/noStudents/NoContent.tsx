import { FunctionComponent } from 'react'
import React from 'react'
import { ReactElement } from 'react'
import { IconType } from 'react-icons/lib'
import { NavLink } from 'react-router-dom'
import Button, { ButtonProps } from '../button/Button.component'
import { IoPersonAddOutline } from 'react-icons/io5'
import { IoArchiveOutline } from 'react-icons/io5'

import './noStudents.style.scss'

interface StudentRowProps {
  heading: string
  buttons?: {
    label: string
    handler: () => void
    icon?: ReactElement<IconType>
  }[]
  children?: React.ReactNode
}

const NoContent: FunctionComponent<StudentRowProps> = ({
  heading,
  buttons,
  children,
}) => {
  return (
    <div className="no-students">
      <div className="content">
        <h3 className="heading-3">{heading}</h3>
        {children}
        <div className="container--buttons">
          {buttons?.map(({ label, handler, icon }) => (
            <Button
              type="button"
              btnStyle="primary"
              label={label}
              handler={handler}
              icon={icon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default NoContent
