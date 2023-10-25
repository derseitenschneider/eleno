import { TRepertoireItem, TSorting } from '../types/types'

const compareTitle = (itemA: TRepertoireItem, itemB: TRepertoireItem) => {
  const titleA = itemA.title
  const titleB = itemB.title
  let comparison = 0
  if (titleA > titleB) {
    comparison = 1
  }
  if (titleA < titleB) {
    comparison = -1
  }

  return comparison
}

const compareStartDate = (itemA: TRepertoireItem, itemB: TRepertoireItem) => {
  const startDateA = itemA.startDate
    ?.split('-')
    .map((el) => el.trim())
    .join('')

  if (!startDateA) return 1

  const startDateB = itemB.startDate
    ?.split('-')
    .map((el) => el.trim())
    .join('')

  if (!startDateB) return -1

  let comparison = 0
  if (startDateA > startDateB) {
    comparison = -1
  }
  if (startDateA < startDateB) {
    comparison = 1
  }
  return comparison
}

const compareEndDate = (itemA: TRepertoireItem, itemB: TRepertoireItem) => {
  const endDateA = itemA.endDate
    ?.split('-')
    .map((el) => el.trim())
    .join('')

  if (!endDateA) return 1
  const endDateB = itemB.endDate
    ?.split('-')
    .map((el) => el.trim())
    .join('')

  if (!endDateB) return -1

  let comparison = 0
  if (endDateA > endDateB) {
    comparison = -1
  }
  if (endDateA < endDateB) {
    comparison = 1
  }
  return comparison
}

const sortRepertoire = (repertoire: TRepertoireItem[], sorting: TSorting) => {
  switch (sorting.sort) {
    case 'title': {
      if (sorting.ascending === 'false') {
        return repertoire.sort(compareTitle).reverse()
      }
      return repertoire.sort(compareTitle)
    }
    case 'startDate': {
      if (sorting.ascending === 'false') {
        return repertoire.sort(compareStartDate).reverse()
      }
      return repertoire.sort(compareStartDate)
    }
    case 'endDate': {
      if (sorting.ascending === 'false') {
        return repertoire.sort(compareEndDate).reverse()
      }
      return repertoire.sort(compareEndDate)
    }

    default:
      return repertoire
  }
}
export default sortRepertoire
