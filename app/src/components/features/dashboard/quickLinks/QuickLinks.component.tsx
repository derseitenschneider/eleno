import {
  IoBookOutline,
  IoCheckboxOutline,
  IoPeopleCircleOutline,
  IoSchoolSharp,
  IoSettingsOutline,
} from "react-icons/io5"
import { useClosestStudent } from "../../../../services/context/ClosestStudentContext"
import { useStudents } from "../../../../services/context/StudentContext"
import QuickLinkItem from "./QuickLinkItem.component"

function QuickLinks() {
  const { setCurrentStudentIndex } = useStudents()

  const { closestStudentIndex } = useClosestStudent()
  const navigateToClosestStudent = () => {
    setCurrentStudentIndex(closestStudentIndex)
  }

  return (
    <div className='col-span-1 row-start-2 row-end-3 p-3 border-b border-hairline'>
      <h2>Quick-Links</h2>
      <div className='flex gap-x-8 gap-y-5 sm:gap-9 flex-wrap'>
        <QuickLinkItem
          title='Unterricht starten'
          icon={<IoSchoolSharp />}
          onClick={navigateToClosestStudent}
          link='lessons'
        />
        <QuickLinkItem
          title='Schüler:in hinzufügen'
          icon={<IoPeopleCircleOutline />}
          link='students?modal=add-students'
          className='hidden md:flex'
        />
        <QuickLinkItem
          title='Todo erfassen'
          icon={<IoCheckboxOutline />}
          link='todos'
        />
        <QuickLinkItem
          title='Einstellungen'
          icon={<IoSettingsOutline />}
          link='settings'
        />
        <QuickLinkItem
          title='Anleitung'
          icon={<IoBookOutline />}
          link='https://manual.eleno.net'
          target='_blank'
        />
      </div>
    </div>
  )
}

export default QuickLinks
