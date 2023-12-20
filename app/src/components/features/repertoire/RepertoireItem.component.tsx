import { HiPencil, HiTrash } from 'react-icons/hi'

import { TRepertoireItem } from '../../../types/types'
import { formatDateToDisplay } from '../../../utils/formateDate'

import Menus from '../../ui/menu/Menus.component'

import Table from '../../ui/table/Table.component'
import Modal from '../../ui/modal/Modal.component'
import EditRepertoireItem from './editRepertoireItem/EditRepertoireItem.component'
import DeleteRepertoireItem from './deleteRepertoireItem/DeleteRepertoireItem.component'

interface ReadRowProps {
  item: TRepertoireItem
}

function RepertoireItem({ item }: ReadRowProps) {
  const { title, startDate, endDate } = item

  return (
    <Table.Row>
      <span>{title}</span>
      <span className="date">
        {startDate ? formatDateToDisplay(startDate) : ''}
      </span>
      <span className="date">
        {endDate ? formatDateToDisplay(endDate) : ''}
      </span>

      <Menus.Toggle id={item.id} />
      <Modal>
        <Menus.Menu>
          <Menus.List id={item.id}>
            <Modal.Open opens="edit-repertoire-item">
              <Menus.Button icon={<HiPencil />}>Bearbeiten</Menus.Button>
            </Modal.Open>

            <Modal.Open opens="delete-repertoire-item">
              <Menus.Button icon={<HiTrash />} iconColor="var(--clr-warning)">
                Löschen
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="edit-repertoire-item">
          <EditRepertoireItem itemId={item.id} />
        </Modal.Window>

        <Modal.Window name="delete-repertoire-item">
          <DeleteRepertoireItem itemId={item.id} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  )
}

export default RepertoireItem
