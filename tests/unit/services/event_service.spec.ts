import { test } from '@japa/runner'
import { EventService } from '#services/event_service'
import { createTestUser } from '../../functional/users/helpers/setup.js'
import {
  createBasicEvent,
  createEventWithAssignments,
} from '../../functional/events/helpers/setup.js'
import Roles from '#enums/roles'
import { EventType } from '#enums/event_type'
import { DateTime } from 'luxon'
import Event from '#models/event'

test.group('EventService', () => {
  test('fetchAllEvents returns all events for admin', async ({ assert }) => {
    const service = new EventService()
    const admin = await createTestUser(Roles.ADMIN)

    await Promise.all([createBasicEvent(), createBasicEvent(), createBasicEvent()])

    const events = await Event.all()
    const fetchedEvents = await service.fetchAllEvents(admin)

    assert.lengthOf(fetchedEvents, events.length)
  })

  test('fetchAllEvents filters by user assignment for non-admin', async ({ assert }) => {
    const service = new EventService()
    const photographer = await createTestUser(Roles.PHOTOGRAPH)

    const ownEvent = await createEventWithAssignments(photographer)
    await createBasicEvent() // event non assigné

    const events = await service.fetchAllEvents(photographer)

    assert.lengthOf(events, 1)
    assert.equal(events[0].id, ownEvent.id)
  })

  test('mapEventToDTO correctly transforms event data', async ({ assert }) => {
    const service = new EventService()
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })
    await event.load('location')
    await event.load('item')
    await event.load('eventAssignments', (query) => query.preload('user', (q) => q.preload('role')))

    const dto = await service.getEventDetails(event.id)

    assert.properties(dto, [
      'id',
      'title',
      'start',
      'end',
      'location',
      'type',
      'itemName',
      'assignments',
    ])
    assert.equal(dto.type, EventType.STUDIO_SHOOT)
    assert.equal(dto.location, event.location.name)
  })

  test('createEvent correctly creates event with assignments', async ({ assert }) => {
    const service = new EventService()
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const baseEvent = await createBasicEvent()

    const eventData = {
      locationId: baseEvent.locationId,
      type: EventType.STUDIO_SHOOT,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      userIds: [photographer.id],
    }

    const event = await service.createEvent(eventData)
    await event.load('eventAssignments')

    assert.equal(event.type, EventType.STUDIO_SHOOT)
    assert.lengthOf(event.eventAssignments, 1)
    assert.equal(event.eventAssignments[0].userId, photographer.id)
  })

  test('updateEvent updates assignments correctly', async ({ assert }) => {
    const service = new EventService()
    const event = await createBasicEvent()
    const photographer1 = await createTestUser(Roles.PHOTOGRAPH)
    const photographer2 = await createTestUser(Roles.PHOTOGRAPH)

    await service.updateEvent(event.id, {
      locationId: event.locationId,
      type: event.type,
      startTime: event.startTime.toJSDate(),
      endTime: event.endTime.toJSDate(),
      assignments: [{ userId: photographer1.id, role: 'photographer' }],
    })

    await service.updateEvent(event.id, {
      locationId: event.locationId,
      type: event.type,
      startTime: event.startTime.toJSDate(),
      endTime: event.endTime.toJSDate(),
      assignments: [{ userId: photographer2.id, role: 'photographer' }],
    })

    await event.refresh()
    await event.load('eventAssignments')

    assert.lengthOf(event.eventAssignments, 1)
    assert.equal(event.eventAssignments[0].userId, photographer2.id)
  })

  test('updateEventDates validates and updates dates', async ({ assert }) => {
    const service = new EventService()
    const event = await createBasicEvent()

    const newStart = DateTime.now().plus({ days: 1 })
    const newEnd = newStart.plus({ hours: 2 })

    await service.updateEventDates(event.id, newStart.toISO(), newEnd.toISO())

    await event.refresh()

    assert.equal(
      event.startTime.toFormat('yyyy-MM-dd HH:mm'),
      newStart.toFormat('yyyy-MM-dd HH:mm')
    )
    assert.equal(event.endTime.toFormat('yyyy-MM-dd HH:mm'), newEnd.toFormat('yyyy-MM-dd HH:mm'))
  })

  test('deleteEvent removes event and related assignments', async ({ assert }) => {
    const service = new EventService()
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createEventWithAssignments(photographer)

    await service.deleteEvent(event.id)

    const deletedEvent = await Event.find(event.id)
    assert.isNull(deletedEvent)

    const assignments = await event.related('eventAssignments').query()
    assert.lengthOf(assignments, 0)
  })
})
