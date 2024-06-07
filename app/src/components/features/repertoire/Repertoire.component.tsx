import { useSearchParams } from "react-router-dom"
import { RepertoireProvider } from "../../../services/context/RepertoireContext"
import RepertoireList from "./repertoireTable/repertoireTable.component"

function Repertoire() {
  const [searchParams] = useSearchParams()
  const studentId = Number(searchParams.get("studentId"))

  return (
    <RepertoireProvider>
      <RepertoireList />
    </RepertoireProvider>
  )
}

export default Repertoire
