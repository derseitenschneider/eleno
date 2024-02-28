import './groupRow.style.scss'
import { IoCheckboxOutline, IoSchool } from 'react-icons/io5'
import {
  HiOutlineDocumentArrowDown,
  HiOutlineListBullet,
  HiPencil,
  HiTrash,
} from 'react-icons/hi2'
import { Tables } from '../../../../types/supabase'
import Menus from '../../../ui/menu/Menus.component'
import Table from '../../../ui/table/Table.component'

export default function GroupRow({ group }: { group: Tables<'groups'> }) {
  return (
    <Table.Row>
      <div>
        <input type="checkbox" name="selected" id={group.groupName} />
      </div>
      <div>
        <span>{group.groupName}</span>
      </div>
      <div>
        <span>{group.dayOfLesson}</span>
      </div>
      <div>
        <span>{group.startOfLesson}</span>
      </div>
      <div>
        <span>{group.endOfLesson}</span>
      </div>
      <div>
        <span>{group.durationMinutes}</span>
      </div>
      <div className="grouprow__students">
        {group.students.map((student) => (
          <span key={student} className="grouprow__student">
            {student}{' '}
          </span>
        ))}
      </div>
      <div>
        <Menus.Toggle id={group.id} />

        <Menus.List id={group.id}>
          <Menus.Button icon={<HiPencil />}>Bearbeiten</Menus.Button>
          <Menus.Button icon={<IoSchool />}>Zum Unterrichtsblatt</Menus.Button>
          <Menus.Button icon={<IoCheckboxOutline />}>
            Todo erfassen
          </Menus.Button>
          <Menus.Button icon={<HiOutlineListBullet />}>Repertoire</Menus.Button>
          <Menus.Button icon={<HiOutlineDocumentArrowDown />}>
            Lektionsliste exportieren
          </Menus.Button>
          <hr />
          <Menus.Button iconColor="var(--clr-warning)" icon={<HiTrash />}>
            Löschen
          </Menus.Button>
        </Menus.List>
      </div>
    </Table.Row>
  )
}
