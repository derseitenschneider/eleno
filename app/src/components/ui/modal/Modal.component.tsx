import React, {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import './modal.style.scss'

import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'

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

const ModalContext = createContext(null)

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const close = useCallback(() => {
    searchParams.delete('modal')
    setSearchParams(searchParams)

    setOpenName('')
  }, [searchParams, setSearchParams])

  const open = setOpenName

  const value = useMemo(
    () => ({ openName, close, open }),
    [openName, close, open],
  )
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useContext(ModalContext)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('modal') === opensWindowName) {
      open(opensWindowName)
    }
  }, [searchParams, opensWindowName, open])

  if (!children) return null

  return cloneElement(children, {
    onClick: () => {
      open(opensWindowName)
    },
  })
}

function Window({ children, name, styles }: WindowProps) {
  const { openName, close } = useContext(ModalContext)

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
    if (name === openName) {
      window.addEventListener('keydown', handleKeydown)
    }

    return () => window.removeEventListener('keydown', handleKeydown)
  }, [close, name, openName])

  const onClickOverlay = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close()
  }

  if (name !== openName) return null

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="overlay" onClick={onClickOverlay}>
      <motion.div
        className="modal"
        style={{ ...styles }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <button type="button" onClick={close} className="modal__btn-close">
          <IoCloseOutline />
        </button>
        {cloneElement(children, { onCloseModal: close })}
      </motion.div>
    </div>,
    document.body,
  )
}

Modal.Open = Open
Modal.Window = Window

export default Modal
