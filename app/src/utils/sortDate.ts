import type { Lesson } from "../types/types"

const sortDate = (a: Lesson, b: Lesson) => {
  return (
    +b.date.split("-").reduce((acc, curr) => acc + curr) -
    +a.date.split("-").reduce((acc, curr) => acc + curr)
  )
}

export default sortDate
