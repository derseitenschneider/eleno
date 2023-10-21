import './modal.style.scss'
import React, {
  FC,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IoCloseOutline } from 'react-icons/io5'

import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

interface ModalProps {
  children: React.ReactNode
}

interface OpenProps {
  children?: React.ReactElement
  opens: string
}

interface WindowProps {
  children: React.ReactElement
  name: string
  styles?: React.CSSProperties
}

interface ModalComp {
  Open: FC<OpenProps>
  Window: FC<WindowProps>
}

const ModalContext = createContext(null)

const Modal: FC<ModalProps> & ModalComp = ({ children }) => {
  const [openName, setOpenName] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const close = () => {
    searchParams.delete('modal')
    setSearchParams(searchParams)

    setOpenName('')
  }
  const open = setOpenName

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  )
}

const Open: FC<OpenProps> = ({ children, opens: opensWindowName }) => {
  const { open } = useContext(ModalContext)

  const [searchParams, _] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('modal') === opensWindowName) {
      open(opensWindowName)
    }
  }, [searchParams, opensWindowName])

  if (!children) return null

  return cloneElement(children, {
    onClick: () => {
      open(opensWindowName)
    },
  })
}

const Window: FC<WindowProps> = ({ children, name, styles }) => {
  const { openName, close, open } = useContext(ModalContext)

  /**
   * Prevent scrollbar jumps
   */
  useEffect(() => {
    const bodyEl = document.querySelector('body')
    const rootEl = document.querySelector('#root') as HTMLDivElement
    const bodyHeight = bodyEl.scrollHeight
    const windowHeight = window.innerHeight
    if (openName === name && bodyHeight > windowHeight) {
      bodyEl.style.overflow = 'hidden'
      bodyEl.style.overflowY = 'scroll'

      rootEl.style.overflowY = 'hidden'
      rootEl.style.maxHeight = '100vh'
    }

    return () => {
      bodyEl.style.overflow = ''
      bodyEl.style.overflowY = ''

      rootEl.style.overflowY = ''
      rootEl.style.maxHeight = ''
    }
  }, [name, openName])

  /**
   * Close on Esc
   */
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (name == openName) {
      window.addEventListener('keydown', handleKeydown)
    }

    return () => window.removeEventListener('keydown', handleKeydown)
  }, [name, openName])

  const onClickOverlay = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close()
  }

  if (name !== openName) return null

  return createPortal(
    <div className="overlay" onClick={onClickOverlay}>
      <motion.div
        className="modal"
        style={{ ...styles }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <button onClick={close} className="modal__btn-close">
          <IoCloseOutline />
        </button>
        {cloneElement(children, { onCloseModal: close })}
      </motion.div>
    </div>,
    document.body
  )
}

Modal.Open = Open
Modal.Window = Window

export default Modal
