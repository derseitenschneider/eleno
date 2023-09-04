import { FC, ReactNode, useEffect } from 'react'
import './modal.style.scss'
import { IoCloseOutline } from 'react-icons/io5'
import Button from '../common/button/Button.component'

interface ModalProps {
  heading?: string
  children?: ReactNode

  handlerClose: () => void
  className?: string
  buttons?: {
    label: string
    handler: (e: React.MouseEvent) => void
    btnStyle: 'primary' | 'secondary' | 'warning' | 'danger'
    className?: string
    disabled?: boolean
  }[]
}

const Modal: FC<ModalProps> = ({
  heading,
  children,

  handlerClose,
  buttons,
  className,
}) => {
  useEffect(() => {
    function closeOnEsc(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        handlerClose()
      }
    }

    window.addEventListener('keydown', closeOnEsc)

    return function () {
      window.removeEventListener('keydown', closeOnEsc)
    }
  }, [])

  return (
    <div className={`container-modal ${className}`}>
      <div className="modal">
        <button onClick={handlerClose} className="button--close-modal">
          <IoCloseOutline />
        </button>
        {heading && <h2 className="heading-2 heading-modal">{heading}</h2>}
        {children}
        {buttons?.length > 0 ? (
          <div className="container-buttons">
            {buttons?.map((button, index) => (
              <Button
                handler={button.handler}
                label={button.label}
                type="button"
                btnStyle={button.btnStyle}
                key={index}
                className={button.className}
                disabled={button.disabled}
              />
            ))}
          </div>
        ) : null}
        <div onClick={handlerClose} className="overlay"></div>
      </div>
    </div>
  )
}

export default Modal
