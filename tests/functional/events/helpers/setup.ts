import { DateTime } from 'luxon'
import { EventType } from '#enums/event_type'
import Event from '#models/event'
import Location from '#models/location'
import Item from '#models/item'
import Set from '#models/set'
import EventAssignment from '#models/event_assignment'
import User from '#models/user'

interface CreateEventOptions {
  type?: EventType
  withItem?: boolean
  withSet?: boolean
  completed?: boolean
  startTime?: DateTime
  endTime?: DateTime
}

export async function createBasicEvent(options: CreateEventOptions = {}) {
  const location = await Location.create({
    name: 'Test Location',
    address: 'Test Address 123',
  })

  const startTime = options.startTime || DateTime.now()
  const endTime = options.endTime || startTime.plus({ hours: 2 })

  const eventData: Partial<Event> = {
    locationId: location.id,
    type: options.type || EventType.STUDIO_SHOOT,
    startTime,
    endTime,
    completed: options.completed || false,
    completedAt: options.completed ? DateTime.now() : null,
  }

  if (options.withItem) {
    const item = await Item.create({ name: 'Test Item', description: 'Test Description' })
    eventData.itemId = item.id
  }

  if (options.withSet) {
    const set = await Set.create({ name: 'Test Set', description: 'Test Description' })
    eventData.setId = set.id
  }

  const event = await Event.create(eventData)
  return event
}

export async function createEventWithAssignments(user: User, options: CreateEventOptions = {}) {
  const event = await createBasicEvent(options)
  await EventAssignment.create({
    eventId: event.id,
    userId: user.id,
  })
  return event
}

export const testEventData = {
  locationId: 1,
  startTime: DateTime.now().plus({ days: 1 }).startOf('hour').toFormat("yyyy-MM-dd'T'HH:mm"),
  endTime: DateTime.now()
    .plus({ days: 1, hours: 2 })
    .startOf('hour')
    .toFormat("yyyy-MM-dd'T'HH:mm"),
  type: EventType.STUDIO_SHOOT,
  userIds: [1],
}
