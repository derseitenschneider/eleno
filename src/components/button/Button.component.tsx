import './button.style.scss'

import { FunctionComponent, ReactElement, ReactNode } from 'react'
import { IconType } from 'react-icons/lib'

export interface ButtonProps {
  type: 'button' | 'submit'
  label?: string
  icon?: ReactElement<IconType>
  btnStyle: 'primary' | 'secondary' | 'icon-only' | 'warning' | 'danger'
  handler?: (e: React.MouseEvent) => void
  className?: string
  children?: ReactNode
  dataref?: string | number
  tabIndex?: number
  disabled?: boolean
}

const Button: FunctionComponent<ButtonProps> = ({
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
}) => {
  return (
    <>
      <button
        type={type}
        className={`button button--${btnStyle} ${className || ''}`}
        onClick={handler}
        data-ref={dataref}
        tabIndex={tabIndex || 0}
        disabled={disabled}
      >
        <>
          {icon && <span>{icon}</span>}
          <span>{label}</span>
          {children}
        </>
      </button>
    </>
  )
}

export default Button
