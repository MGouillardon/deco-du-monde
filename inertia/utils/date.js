import { DateTime } from 'luxon'

export const DATE_FORMAT = 'yyyy-MM-dd'
export const TIME_FORMAT = 'HH:mm'
export const DATETIME_FORMAT = `${DATE_FORMAT}T${TIME_FORMAT}`

export function parseISOString(isoString) {
  return DateTime.fromISO(isoString)
}

export function formatDateTime(dateTime) {
  return dateTime.toFormat(DATETIME_FORMAT)
}

export function createDateTime(date, time) {
  return DateTime.fromFormat(`${date} ${time}`, `${DATE_FORMAT} ${TIME_FORMAT}`)
}

export function isValidDateRange(start, end) {
  const startDT = parseISOString(start)
  const endDT = parseISOString(end)
  return endDT > startDT
}

export function getDefaultStartTime() {
  return DateTime.now().startOf('hour').plus({ hours: 1 }).toFormat(TIME_FORMAT)
}

export function getDefaultEndTime(startTime) {
  return DateTime.fromFormat(startTime, TIME_FORMAT).plus({ hours: 1 }).toFormat(TIME_FORMAT)
}

export function generateTimeOptions() {
  const options = []
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      options.push(DateTime.fromObject({ hour, minute }).toFormat(TIME_FORMAT))
    }
  }
  return options
}
