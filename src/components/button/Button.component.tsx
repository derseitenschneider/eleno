import { spawn } from 'child_process'
import { FunctionComponent, ReactElement, ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { NavLinkProps } from 'react-router-dom'

import './button.style.scss'

interface ButtonProps {
  type: 'button' | 'submit'
  label?: string
  icon?: ReactElement<IconType>
  btnStyle: 'primary' | 'secondary' | 'icon-only' | 'warning' | 'danger'
  handler?: (e: React.MouseEvent) => void
  className?: string
  children?: ReactNode
  dataref?: string | number
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  icon,
  type,
  btnStyle,
  handler,
  className,
  children,
  dataref,
}) => {
  return (
    <>
      <button
        type={type}
        className={`button button--${btnStyle} ${className}`}
        onClick={handler}
        data-ref={dataref}
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
