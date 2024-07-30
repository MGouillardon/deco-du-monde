import Factory from '@adonisjs/lucid/factories'
import Schedule from '#models/schedule'
import { ScheduleType } from '#enums/schedule_type'
import { DateTime } from 'luxon'

export const ScheduleFactory = Factory.define(Schedule, ({ faker }) => {
  const startTime = DateTime.fromJSDate(faker.date.future())
  const endTime = startTime.plus({ hours: faker.number.int({ min: 2, max: 8 }) })
  const type = faker.helpers.arrayElement(Object.values(ScheduleType))

  return {
    startTime,
    endTime,
    type,
  }
}).build()
