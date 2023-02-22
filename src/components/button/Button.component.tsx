import { spawn } from 'child_process'
import { FunctionComponent, ReactElement } from 'react'
import { IconType } from 'react-icons/lib'

import './button.style.scss'

interface ButtonProps {
  type: 'button' | 'submit'
  label?: string
  icon?: ReactElement<IconType>
  btnStyle: 'primary' | 'secondary' | 'warming' | 'danger'
  handler?: (e: React.MouseEvent) => void
  className?: string
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  icon,
  type,
  btnStyle,
  handler,
  className,
}) => {
  return (
    <>
      <button
        type={type}
        className={`button button--${btnStyle} ${className}`}
        onClick={handler}
      >
        <>
          <span>{label}</span>
          {icon && <span>{icon}</span>}
        </>
      </button>
    </>
  )
}

export default Button
