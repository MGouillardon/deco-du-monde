export const DATE_FORMAT = 'yyyy-MM-dd'
export const TIME_FORMAT = 'HH:mm'
export const DATETIME_FORMAT = `${DATE_FORMAT}T${TIME_FORMAT}`

export function generateTimeOptions() {
  const options = []
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 20 && minute === 30) continue
      options.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
    }
  }
  return options
}
export function getDefaultTime() {
  return '08:00'
}

export function calculateEndTime(startTime) {
  const [hour, minute] = startTime.split(':')
  let endHour = Number.parseInt(hour)
  let endMinute = Number.parseInt(minute) + 30

  if (endMinute >= 60) {
    endHour++
    endMinute -= 60
  }

  if (endHour > 20) {
    endHour = 20
    endMinute = 0
  }

  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
}

export function isEndTimeValid(startDate, startTime, endDate, endTime) {
  if (startDate === endDate && endTime <= startTime) {
    return false
  }
  return true
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}
