import { IoEllipsisVertical } from 'react-icons/io5'
import './menus.style.scss'
import {
  FC,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useOutsideClick } from '../../../hooks/useOutsideClick'
import { AnimatePresence, motion } from 'framer-motion'

interface MenusProps {
  children: ReactNode
  icon?: ReactNode
}

interface MenuProps {
  children: React.ReactElement
}

interface ToggleProbs {
  id: number | string
}

interface ListProps {
  children: ReactNode
  id: number | string
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  icon: ReactNode
  iconColor?: string
}

interface MenuComp {
  Toggle: FC<ToggleProbs>
  Menu: FC<MenuProps>
  List: FC<ListProps>
  Button: FC<ButtonProps>
}

type TPosition = {
  x: number
  y: number
}

const MenusContext = createContext(null)

const Menus: FC<MenusProps> & MenuComp = ({
  children,
  icon = <IoEllipsisVertical />,
}) => {
  const [openId, setOpenId] = useState('')
  const [position, setPosition] = useState<TPosition>(null)

  const open = setOpenId
  const close = () => setOpenId(null)
  const MAX_HEIGHT = 200

  return (
    <MenusContext.Provider
      value={{
        open,
        close,
        openId,
        position,
        setPosition,
        icon,
        MAX_HEIGHT,
      }}
    >
      {children}
    </MenusContext.Provider>
  )
}

const Menu: FC<MenuProps> = ({ children }) => {
  const { openId } = useContext(MenusContext)
  return cloneElement(children, { openId })
}

const Toggle: FC<ToggleProbs> = ({ id }) => {
  const { open, openId, close, setPosition, icon, MAX_HEIGHT } =
    useContext(MenusContext)
  const toggleRef = useRef(null)

  const getPosition = () => {
    const toggle = toggleRef.current as Element
    const toggleRect = toggle.closest('button').getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const togglePositionHorizontal: 'left' | 'right' =
      toggleRect.x < windowWidth / 2 ? 'left' : 'right'

    const togglePositionVertical: 'top' | 'bottom' =
      windowHeight - toggleRect.y > MAX_HEIGHT ? 'top' : 'bottom'

    let xPosition: number
    let yPosition: number

    if (togglePositionHorizontal === 'left') {
      xPosition = toggleRect.x
    } else if (togglePositionHorizontal === 'right') {
      xPosition = windowWidth - toggleRect.x - toggleRect.width
    }

    if (togglePositionVertical === 'top') {
      yPosition = toggleRect.y + toggleRect.height + 8
    } else if (togglePositionVertical === 'bottom') {
      yPosition = windowHeight - toggleRect.y
    }
    // const
    setPosition({
      x: xPosition,
      y: yPosition,
      verticalDirection: togglePositionVertical,
      horizontalDirection: togglePositionHorizontal,
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      close()
    }
    if (id === openId) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [openId])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    openId === '' || id !== openId ? open(id) : close()
    getPosition()
  }

  return (
    <button className="menu__toggle" onClick={handleClick} ref={toggleRef}>
      {icon}
    </button>
  )
}

const List: FC<ListProps> = ({ children, id }) => {
  const { openId, position, close, MAX_HEIGHT } = useContext(MenusContext)
  const menuRef = useOutsideClick(close, false)
  const isVisible = openId === id
  // if (!isVisible) return null

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.ul
          className="menu__list"
          style={{
            [position.verticalDirection]: position.y,
            [position.horizontalDirection]: position.x,
            maxHeight: MAX_HEIGHT,
          }}
          ref={menuRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ ease: 'easeIn', duration: 0.05 }}
          exit={{ opacity: 0, height: 0 }}
        >
          {children}
        </motion.ul>
      )}
    </AnimatePresence>,
    document.body
  )
}

const Button: FC<ButtonProps> = ({
  icon,
  iconColor = 'var(--clr-primary-600)',
  children,
  onClick,
}) => {
  const { close } = useContext(MenusContext)

  const handleClick = () => {
    onClick?.()
    close()
  }

  return (
    <li className="menu__button" onClick={handleClick}>
      <span style={{ color: iconColor }}>{icon}</span>
      <span>{children}</span>
    </li>
  )
}

Menus.Toggle = Toggle
Menus.Menu = Menu
Menus.List = List
Menus.Button = Button

export default Menus
