import Factory from '@adonisjs/lucid/factories'
import Event from '#models/event'
import { EventType } from '#enums/event_type'
import { DateTime } from 'luxon'

export const EventFactory = Factory.define(Event, ({ faker }) => {
  const startTime = DateTime.fromJSDate(faker.date.future())
  const endTime = startTime.plus({ hours: faker.number.int({ min: 2, max: 8 }) })
  const type = faker.helpers.arrayElement(Object.values(EventType))

  return {
    startTime,
    endTime,
    type,
  }
}).build()
