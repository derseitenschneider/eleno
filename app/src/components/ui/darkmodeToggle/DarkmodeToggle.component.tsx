import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import * as Switch from '@radix-ui/react-switch'

import './darkmodeToggle.style.scss'
import { useDarkMode } from '../../../services/context/DarkModeContext'

export default function DarkmodeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <form className="toggle-darkmode">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <label
          className="Label"
          htmlFor="airplane-mode"
          style={{ paddingRight: 15 }}
        >
          Airplane mode
        </label> */}
        <Switch.Root
          className="SwitchRoot"
          id="airplane-mode"
          onCheckedChange={toggleDarkMode}
          checked={isDarkMode}
        >
          <Switch.Thumb className="SwitchThumb">
            {isDarkMode ? <HiOutlineMoon /> : <HiOutlineSun />}
          </Switch.Thumb>
        </Switch.Root>
      </div>
    </form>
    // <button className="toggle-darkmode" type="button" onClick={toggleDarkMode}>
    //   {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    // </button>
  )
}
