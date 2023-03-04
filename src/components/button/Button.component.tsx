import { spawn } from 'child_process'
import { FunctionComponent, ReactElement, ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { NavLinkProps } from 'react-router-dom'

import './button.style.scss'

interface ButtonProps {
  type: 'button' | 'submit'
  label?: string
  icon?: ReactElement<IconType>
  btnStyle: 'primary' | 'secondary' | 'icon-only' | 'warming' | 'danger'
  handler?: (e: React.MouseEvent) => void
  className?: string
  children?: ReactNode
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  icon,
  type,
  btnStyle,
  handler,
  className,
  children,
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
          {children}
        </>
      </button>
    </>
  )
}

export default Button
