import { useGroups } from '../../../services/context/GroupsContext'
import Menus from '../../ui/menu/Menus.component'
import Table from '../../ui/table/Table.component'
import GroupRow from './groupRow/GroupRow.component'

export default function Groups() {
  const { groups } = useGroups()
  const columns = `4rem 24rem 10rem repeat(3, 7rem) 1fr 4rem`
  return (
    <div className="groups">
      <Table columns={columns}>
        <Table.Header>
          <div>
            <input type="checkbox" name="" id="" />
          </div>
          <div>
            <span>Name</span>
          </div>
          <div>
            <span>Tag</span>
          </div>
          <div>
            <span>Von</span>
          </div>
          <div>
            <span>Bis</span>
          </div>
          <div>
            <span>Dauer</span>
          </div>
          <div>Schüler:innen</div>
          <div />
        </Table.Header>
        <Menus>
          <Table.Body
            data={groups}
            render={(group) => (
              <Menus.Menu key={group.id}>
                <GroupRow group={group} />
              </Menus.Menu>
            )}
            emptyMessage="Keine Gruppen vorhanden"
          />
        </Menus>
      </Table>
    </div>
  )
}
