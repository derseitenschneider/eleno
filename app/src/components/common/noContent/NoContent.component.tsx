import './noContent.style.scss'

import { FunctionComponent } from 'react'
import React from 'react'
import { ReactElement } from 'react'
import { IconType } from 'react-icons/lib'
import Button from '../button/Button.component'

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
    <div className="no-content">
      <div className="content">
        <h3 className="heading-3">{heading}</h3>
        {children}
        <div className="container--buttons">
          {buttons?.map(({ label, handler, icon }, index) => (
            <Button
              type="button"
              btnStyle="primary"
              label={label}
              handler={handler}
              icon={icon}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default NoContent
