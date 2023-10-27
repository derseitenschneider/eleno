const calcTimeDifference = (startTime: string, endTime: string) => {
  const hourStartTime = +startTime.split(':')[0]
  const hourEndTime = +endTime.split(':')[0]

  const minutesStartTime = +startTime.split(':')[1]
  const minutesEndTime = +endTime.split(':')[1]

  const hourDiffInMinutes = (hourEndTime - hourStartTime) * 60

  const minutesDiff = minutesEndTime - minutesStartTime

  const totalDiffInMin = minutesDiff + hourDiffInMinutes

  return totalDiffInMin
}

export default calcTimeDifference
