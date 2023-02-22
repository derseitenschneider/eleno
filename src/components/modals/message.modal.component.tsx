import { FunctionComponent } from 'react'
import './message.modal.style.scss'
import { IoCloseOutline } from 'react-icons/io5'
import Button from '../button/Button.component'

interface MessageModalProps {
  heading: string
  body: string
  handlerOverlay: (e: React.MouseEvent) => void
  handlerClose: (e: React.MouseEvent) => void
  buttons: {
    label: string
    handler: (e: React.MouseEvent) => void
    btnStyle: 'primary' | 'secondary' | 'warming' | 'danger'
  }[]
}

const MessageModal: FunctionComponent<MessageModalProps> = ({
  heading,
  body,
  handlerOverlay,
  handlerClose,
  buttons,
}) => {
  return (
    <div className="container-modal">
      <div className="modal">
        <button onClick={handlerClose} className="button--close-modal">
          <IoCloseOutline />
        </button>
        <h1>{heading}</h1>
        <p>{body}</p>
        <div className="container-buttons">
          {buttons.map((button) => (
            <Button
              handler={button.handler}
              label={button.label}
              type="button"
              btnStyle={button.btnStyle}
            />
          ))}
        </div>
        <div onClick={handlerOverlay} className="overlay"></div>
      </div>
    </div>
  )
}

export default MessageModal
