import { HiSelector } from 'react-icons/hi'
import Menus from '../menu/Menus.component'

interface SelectProps {
  disabled?: boolean
  label: string
  options: { name: string; icon: React.ReactElement; iconColor?: string }[]
  selected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
}

function Select({
  disabled = false,
  label,
  options,
  selected,
  setSelected,
}: SelectProps) {
  return (
    <Menus icon={<HiSelector />}>
      <Menus.Toggle id="action" label={selected || label} disabled={disabled} />

      <Menus.Menu>
        <Menus.List id="action">
          {options.map((option) => (
            <Menus.Button
              icon={option.icon}
              iconColor={option.iconColor}
              key={option.name}
              onClick={() => setSelected(option.name)}
            >
              {option.name}
            </Menus.Button>
          ))}
        </Menus.List>
      </Menus.Menu>
    </Menus>
  )
}

export default Select
