// tests/unit/services/event_service.spec.ts

import { test } from '@japa/runner'
import { EventService, EventDTO } from '#services/event_service'
import { EventFactory } from '#database/factories/event_factory'
import { UserFactory } from '#database/factories/user_factory'
import { LocationFactory } from '#database/factories/location_factory'
import { SetFactory } from '#database/factories/set_factory'
import { ItemFactory } from '#database/factories/item_factory'
import { EventType } from '#enums/event_type'
import Database from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Event from '#models/event'
import { Exception } from '@adonisjs/core/exceptions'

test.group('EventService', (group) => {
  let eventService: EventService
  let mockLocation: any
  let mockSet: any
  let mockItem: any
  let mockUser: any

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    eventService = new EventService()
    mockLocation = await LocationFactory.create()
    mockSet = await SetFactory.create()
    mockItem = await ItemFactory.create()
    mockUser = await UserFactory.with('role').create()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('fetchAllEvents returns all events', async ({ assert }) => {
    const mockEvents = await EventFactory.merge([
      { locationId: mockLocation.id, itemId: mockItem.id, type: EventType.STUDIO_SHOOT },
      { locationId: mockLocation.id, setId: mockSet.id, type: EventType.SET_SHOOT },
    ]).createMany(2)

    const events = await eventService.fetchAllEvents()

    assert.equal(events.length, 2)
    assert.equal(events[0].id, mockEvents[0].id)
    assert.equal(events[1].id, mockEvents[1].id)
    assert.equal(events[0].type, EventType.STUDIO_SHOOT)
    assert.equal(events[1].type, EventType.SET_SHOOT)
  })

  test('getEventFormData returns correct form data', async ({ assert }) => {
    const formData = await eventService.getEventFormData()

    assert.property(formData, 'locations')
    assert.property(formData, 'sets')
    assert.property(formData, 'items')
    assert.property(formData, 'usersByRole')
    assert.property(formData, 'eventTypes')

    assert.isArray(formData.locations)
    assert.isArray(formData.sets)
    assert.isArray(formData.items)
    assert.isObject(formData.usersByRole)
    assert.isObject(formData.eventTypes)

    assert.equal(formData.locations[0].id, mockLocation.id)
    assert.equal(formData.sets[0].id, mockSet.id)
    assert.equal(formData.items[0].id, mockItem.id)
    assert.property(formData.usersByRole, mockUser.role.name.toLowerCase())
    assert.deepEqual(formData.eventTypes, Object.fromEntries(Object.entries(EventType)))
  })

  test('createEvent creates a new event', async ({ assert }) => {
    const eventData = {
      locationId: mockLocation.id,
      startTime: DateTime.now().toJSDate(),
      endTime: DateTime.now().plus({ hours: 2 }).toJSDate(),
      type: EventType.STUDIO_SHOOT,
      itemId: mockItem.id,
      userIds: [mockUser.id],
    }

    const createdEvent = await eventService.createEvent(eventData)

    assert.instanceOf(createdEvent, Event)
    assert.equal(createdEvent.locationId, mockLocation.id)
    assert.equal(createdEvent.type, EventType.STUDIO_SHOOT)
    assert.equal(createdEvent.itemId, mockItem.id)

    const eventAssignments = await createdEvent.related('eventAssignments').query()
    assert.equal(eventAssignments.length, 1)
    assert.equal(eventAssignments[0].userId, mockUser.id)
  })

  test('getEventDetails returns correct event details', async ({ assert }) => {
    const mockEvent = await EventFactory.merge({
      locationId: mockLocation.id,
      itemId: mockItem.id,
      type: EventType.STUDIO_SHOOT,
    }).create()

    await mockEvent.related('eventAssignments').create({ userId: mockUser.id })

    const eventDetails = await eventService.getEventDetails(mockEvent.id)

    assert.equal(eventDetails.id, mockEvent.id)
    assert.equal(eventDetails.location, mockLocation.name)
    assert.equal(eventDetails.type, EventType.STUDIO_SHOOT)
    assert.equal(eventDetails.itemId, mockItem.id)
    assert.equal(eventDetails.assignments?.length, 1)
    assert.equal(eventDetails.assignments?.[0].user.id, mockUser.id)
  })

  test('updateEvent updates an existing event', async ({ assert }) => {
    const mockEvent = await EventFactory.merge({
      locationId: mockLocation.id,
      itemId: mockItem.id,
      type: EventType.STUDIO_SHOOT,
    }).create()

    const updatedData = {
      locationId: mockLocation.id,
      startTime: DateTime.now().toJSDate(),
      endTime: DateTime.now().plus({ hours: 3 }).toJSDate(),
      type: EventType.SET_SHOOT,
      setId: mockSet.id,
      assignments: [{ userId: mockUser.id }],
    }

    const updatedEvent = await eventService.updateEvent(mockEvent.id, updatedData)

    assert.equal(updatedEvent.type, EventType.SET_SHOOT)
    assert.equal(updatedEvent.setId, mockSet.id)

    const eventAssignments = await updatedEvent.related('eventAssignments').query()
    assert.equal(eventAssignments.length, 1)
    assert.equal(eventAssignments[0].userId, mockUser.id)
  })

  test('updateEventDates updates event dates', async ({ assert }) => {
    const mockEvent = await EventFactory.merge({
      locationId: mockLocation.id,
      itemId: mockItem.id,
    }).create()

    const newStartTime = DateTime.now().plus({ days: 1 })
    const newEndTime = newStartTime.plus({ hours: 2 })

    const updatedEvent = await eventService.updateEventDates(
      mockEvent.id,
      newStartTime.toISO(),
      newEndTime.toISO()
    )

    assert.instanceOf(updatedEvent.startTime, DateTime)
    assert.instanceOf(updatedEvent.endTime, DateTime)
    assert.equal(updatedEvent.startTime.toISO(), newStartTime.toISO())
    assert.equal(updatedEvent.endTime.toISO(), newEndTime.toISO())
  })

  test('deleteEvent deletes an event', async ({ assert }) => {
    const mockEvent = await EventFactory.merge({
      locationId: mockLocation.id,
      itemId: mockItem.id,
    }).create()

    await eventService.deleteEvent(mockEvent.id)

    const deletedEvent = await Event.find(mockEvent.id)
    assert.isNull(deletedEvent)
  })

  test('getEventTitle returns correct title for each event type', async ({ assert }) => {
    const studioShootEvent = await EventFactory.merge({
      type: EventType.STUDIO_SHOOT,
      itemId: mockItem.id,
    }).create()
    const setShootEvent = await EventFactory.merge({
      type: EventType.SET_SHOOT,
      setId: mockSet.id,
    }).create()
    const setPreparationEvent = await EventFactory.merge({
      type: EventType.SET_PREPARATION,
    }).create()
    const setRemovalEvent = await EventFactory.merge({
      type: EventType.SET_REMOVAL,
    }).create()

    const events = await eventService.fetchAllEvents()

    const studioShootTitle = events.find((e) => e.id === studioShootEvent.id)?.title
    const setShootTitle = events.find((e) => e.id === setShootEvent.id)?.title
    const setPreparationTitle = events.find((e) => e.id === setPreparationEvent.id)?.title
    const setRemovalTitle = events.find((e) => e.id === setRemovalEvent.id)?.title

    assert.equal(studioShootTitle, `Studio Shoot: ${mockItem.name}`)
    assert.equal(setShootTitle, `Set Shoot: ${mockSet.name}`)
    assert.equal(setPreparationTitle, 'Set Preparation')
    assert.equal(setRemovalTitle, 'Set Removal')
  })

  test('groupUsersByRole correctly groups users', async ({ assert }) => {
    const photographer = await UserFactory.merge({ role: { name: 'Photographer' } })
      .with('role')
      .create()
    const assistant = await UserFactory.merge({ role: { name: 'Assistant' } })
      .with('role')
      .create()

    const formData = await eventService.getEventFormData()

    assert.property(formData.usersByRole, 'photographer')
    assert.property(formData.usersByRole, 'assistant')
    assert.include(formData.usersByRole.photographer, photographer)
    assert.include(formData.usersByRole.assistant, assistant)
  })

  test('createEvent throws an error for invalid event type', async ({ assert }) => {
    const invalidEventData = {
      locationId: mockLocation.id,
      startTime: DateTime.now().toJSDate(),
      endTime: DateTime.now().plus({ hours: 2 }).toJSDate(),
      type: 'INVALID_TYPE' as EventType,
      itemId: mockItem.id,
    }

    await assert.rejects(() => eventService.createEvent(invalidEventData), Exception)
  })

  test('getEventDetails throws an error for non-existent event', async ({ assert }) => {
    await assert.rejects(() => eventService.getEventDetails(99999), Exception)
  })
})
