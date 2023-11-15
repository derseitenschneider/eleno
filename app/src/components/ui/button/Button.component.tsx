import './button.style.scss'

import { ReactElement } from 'react'
import { IconType } from 'react-icons/lib'

export interface ButtonProps {
  type: 'button' | 'submit'
  label?: string
  icon?: ReactElement<IconType>
  btnStyle: 'primary' | 'secondary' | 'icon-only' | 'warning' | 'danger'
  handler?: (e: React.MouseEvent) => void
  className?: string
  children?: React.ReactNode
  dataref?: string | number
  tabIndex?: number
  disabled?: boolean
  size?: 'md' | 'sm'
  title?: string
  onClick?: () => void
}

function Button({
  label,
  icon,
  type,
  btnStyle,
  handler,
  className,
  children,
  tabIndex,
  dataref,
  disabled,
  onClick,
  size = 'md',
  title,
}: ButtonProps) {
  return (
    <button
      type={type === 'button' ? 'button' : 'submit'}
      className={`button button--${btnStyle} button--${size} ${
        className || ''
      }`}
      onClick={handler || onClick}
      data-ref={dataref}
      tabIndex={tabIndex || 0}
      disabled={disabled}
      title={title}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {children}
    </button>
  )
}

export default Button
