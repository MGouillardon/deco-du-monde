import { test } from '@japa/runner'
import { EventType } from '#enums/event_type'
import { DateTime } from 'luxon'
import { EventService, EventDTO } from '#services/event_service'
import app from '@adonisjs/core/services/app'
import User from '#models/user'
import Event from '#models/event'
import sinon from 'sinon'

const ROUTE_EVENTS_INDEX = '/admin/dashboard/events/index'
const COMPONENT_EVENTS_INDEX = 'Admin/Dashboard/Events/Index'
const ROUTE_EVENTS_CREATE = '/admin/dashboard/events/create'
const COMPONENT_EVENTS_CREATE = 'Admin/Dashboard/Events/Create'
const ROUTE_EVENTS_STORE = '/admin/dashboard/events/store'
const ROUTE_EVENTS_UPDATE = '/admin/dashboard/events/update'

interface UsersByRole {
  photograph: User[]
  assistant_photograph: User[]
  decorator: User[]
  assistant_decorator: User[]
  driver_assistant: User[]
}

test.group('EventController', (group) => {
  let mockUser: User
  let userFindStub: sinon.SinonStub

  group.each.setup(() => {
    app.container.restore(EventService)

    // Create a mock user instance
    mockUser = new User()
    mockUser.$attributes = {
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'password',
      roleId: 1,
      isPasswordChanged: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }

    // Stub User.find to return the mock user
    userFindStub = sinon.stub(User, 'find').resolves(mockUser)
  })

  group.each.teardown(() => {
    app.container.restore(EventService)
    userFindStub.restore() // Restore the original User.find method
  })

  test('index method returns correct events and props', async ({ client, assert }) => {
    const mockedEvents: EventDTO[] = [
      {
        id: 1,
        title: 'Studio Shoot: Test Item',
        start: DateTime.now().toISO(),
        end: DateTime.now().plus({ hours: 2 }).toISO(),
        location: 'Test Location',
        type: EventType.STUDIO_SHOOT,
        itemId: 1,
        itemName: 'Test Item',
        setId: null,
        setName: null,
        assignments: [
          {
            id: 1,
            user: {
              id: 1,
              fullName: 'Test User',
              role: 'Test Role',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Set Shoot: Test Set',
        start: DateTime.now().toISO(),
        end: DateTime.now().plus({ hours: 2 }).toISO(),
        location: 'Test Location',
        type: EventType.SET_SHOOT,
        itemId: null,
        itemName: null,
        setId: 1,
        setName: 'Test Set',
        assignments: [
          {
            id: 2,
            user: {
              id: 2,
              fullName: 'Test User',
              role: 'Test Role',
            },
          },
        ],
      },
    ]

    class MockedEventService extends EventService {
      async fetchAllEvents(): Promise<EventDTO[]> {
        return mockedEvents
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .get(ROUTE_EVENTS_INDEX)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent(COMPONENT_EVENTS_INDEX)

    const { events, title, auth } = response.inertiaProps

    assert.equal(title, 'Calendar', 'The title should be "Calendar"')
    assert.deepEqual(events, mockedEvents, 'The events should match the mocked events')

    assert.equal(auth.id, mockUser.id, 'The authenticated user ID should match the mock user')
    assert.equal(
      auth.fullName,
      mockUser.fullName,
      'The authenticated user name should match the mock user'
    )
    assert.equal(
      auth.email,
      mockUser.email,
      'The authenticated user email should match the mock user'
    )
  })

  test('index method handles empty event list', async ({ client, assert }) => {
    class MockedEmptyEventService extends EventService {
      async fetchAllEvents(): Promise<EventDTO[]> {
        return []
      }
    }

    app.container.swap(EventService, () => new MockedEmptyEventService())

    const response = await client
      .get(ROUTE_EVENTS_INDEX)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent(COMPONENT_EVENTS_INDEX)

    const { events, title } = response.inertiaProps

    assert.equal(title, 'Calendar', 'The title should be "Calendar"')
    assert.isEmpty(events, 'The events array should be empty')
  })

  test('create method returns correct form data for event creation', async ({ client, assert }) => {
    const response = await client
      .get(ROUTE_EVENTS_CREATE)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent(COMPONENT_EVENTS_CREATE)

    const { title, locations, sets, items, usersByRole, eventTypes, auth } = response.inertiaProps

    // Assert title
    assert.equal(title, 'Create an Event')

    // Assert locations
    assert.isArray(locations)
    assert.isNotEmpty(locations)
    assert.properties(locations[0], ['id', 'name'])

    // Assert sets
    assert.isArray(sets)
    assert.isNotEmpty(sets)
    assert.properties(sets[0], ['id', 'name'])

    // Assert items
    assert.isArray(items)
    assert.isNotEmpty(items)
    assert.properties(items[0], ['id', 'name'])

    // Assert usersByRole
    assert.isObject(usersByRole)
    const typedUsersByRole = usersByRole as UsersByRole
    assert.properties(typedUsersByRole, [
      'photograph',
      'assistant_photograph',
      'decorator',
      'assistant_decorator',
      'driver_assistant',
    ])

    Object.entries(typedUsersByRole).forEach(([role, users]) => {
      assert.isArray(users, `${role} should be an array`)
      assert.isNotEmpty(users, `${role} should not be empty`)
      assert.properties(users[0], ['id', 'fullName', 'roleName'])
    })

    // Assert eventTypes
    assert.deepEqual(eventTypes, Object.fromEntries(Object.entries(EventType)))

    // Assert auth
    assert.isObject(auth)
    assert.properties(auth, ['id', 'fullName', 'email', 'roleName', 'isPasswordChanged'])
  })

  test('successfully creates an event', async ({ client }) => {
    const validEventData = {
      locationId: 1,
      startTime: DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
      endTime: DateTime.now().plus({ hours: 2 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      type: EventType.STUDIO_SHOOT,
      itemId: 1,
      userIds: [1, 2, 3],
    }

    class MockedEventService extends EventService {
      async createEvent(data: any): Promise<Event> {
        return { id: 1, ...data } as Event
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .post(ROUTE_EVENTS_STORE)
      .form(validEventData)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent(COMPONENT_EVENTS_INDEX)
    response.assertRedirectsTo('/admin/dashboard/events/index')

    response.assertInertiaPropsContains({ success: 'Event created successfully' })
  })

  test('handles validation errors', async ({ client, assert }) => {
    const invalidEventData = {
      locationId: 'invalid',
      startTime: 'invalid-date',
      type: 'invalid-type',
    }

    const response = await client
      .post(ROUTE_EVENTS_STORE)
      .form(invalidEventData)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent(COMPONENT_EVENTS_CREATE)

    const { errors } = response.inertiaProps

    assert.isArray(errors, 'Errors should be an array')

    const errorFields = errors.map((error: any) => error.field)
    assert.include(errorFields, 'locationId', 'Should have locationId error')
    assert.include(errorFields, 'startTime', 'Should have startTime error')
    assert.include(errorFields, 'endTime', 'Should have endTime error')
    assert.include(errorFields, 'type', 'Should have type error')
    assert.include(errorFields, 'userIds', 'Should have userIds error')

    assert.isTrue(
      errors.some((error: any) => error.field === 'locationId' && error.rule === 'number'),
      'Should have number validation error for locationId'
    )

    assert.isTrue(
      errors.some((error: any) => error.field === 'startTime' && error.rule === 'date'),
      'Should have date validation error for startTime'
    )

    assert.isTrue(
      errors.some((error: any) => error.field === 'endTime' && error.rule === 'required'),
      'Should have required validation error for endTime'
    )

    assert.isTrue(
      errors.some((error: any) => error.field === 'type' && error.rule === 'enum'),
      'Should have enum validation error for type'
    )

    assert.isTrue(
      errors.some((error: any) => error.field === 'userIds' && error.rule === 'required'),
      'Should have required validation error for userIds'
    )

    response.assertHeaderMissing('location')
  })

  test('show method returns correct event details', async ({ client, assert }) => {
    const mockedEvent: EventDTO = {
      id: 1,
      title: 'Studio Shoot: Test Item',
      start: DateTime.now().toISO(),
      end: DateTime.now().plus({ hours: 2 }).toISO(),
      location: 'Test Location',
      locationId: 1,
      type: EventType.STUDIO_SHOOT,
      itemId: 1,
      itemName: 'Test Item',
      setId: null,
      setName: null,
      assignments: [
        {
          id: 1,
          user: {
            id: 1,
            fullName: 'Test User',
            role: 'Test Role',
          },
        },
      ],
    }

    class MockedEventService extends EventService {
      async getEventDetails(): Promise<EventDTO> {
        return mockedEvent
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .get(`/admin/dashboard/events/show/1`)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Show')

    const { event, title } = response.inertiaProps

    assert.equal(title, mockedEvent.title)
    assert.deepEqual(event, mockedEvent)
  })

  test('edit method returns correct event and form data', async ({ client, assert }) => {
    const mockedEvent: EventDTO = {
      id: 1,
      title: 'Studio Shoot: Test Item',
      start: DateTime.now().toISO(),
      end: DateTime.now().plus({ hours: 2 }).toISO(),
      location: 'Test Location',
      locationId: 1,
      type: EventType.STUDIO_SHOOT,
      itemId: 1,
      itemName: 'Test Item',
      setId: null,
      setName: null,
      assignments: [
        {
          id: 1,
          user: {
            id: 1,
            fullName: 'Test User',
            role: 'Test Role',
          },
        },
      ],
    }

    const mockedFormData = {
      locations: [{ id: 1, name: 'Test Location' }],
      sets: [{ id: 1, name: 'Test Set' }],
      items: [{ id: 1, name: 'Test Item' }],
      usersByRole: {
        photograph: [{ id: 1, fullName: 'Test User', roleName: 'Photograph' }],
      },
      eventTypes: Object.fromEntries(Object.entries(EventType)),
      auth: {
        id: mockUser.id,
        fullName: mockUser.fullName,
        email: mockUser.email,
        roleName: mockUser.roleName,
        isPasswordChanged: mockUser.isPasswordChanged,
      },
    }

    class MockedEventService extends EventService {
      async getEventDetails(id: number): Promise<EventDTO> {
        return mockedEvent
      }

      async getEventFormData() {
        return mockedFormData
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .get(`/admin/dashboard/events/edit/1`)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Edit')

    response.assertInertiaPropsContains({
      title: 'Edit Event',
      event: mockedEvent,
      ...mockedFormData,
    })
  })

  test('successfully updates an event', async ({ client, assert }) => {
    const eventId = 1
    const validUpdateData = {
      locationId: 2,
      startTime: DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
      endTime: DateTime.now().plus({ hours: 3 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      type: EventType.SET_SHOOT,
      setId: 1,
      assignments: [{ userId: 1 }, { userId: 2 }],
    }

    class MockedEventService extends EventService {
      async updateEvent(id: number, data: any): Promise<Event> {
        assert.equal(id, eventId)
        assert.deepEqual(data, validUpdateData)
        return { id, ...data } as Event
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .put(`/admin/dashboard/events/update/${eventId}`)
      .form(validUpdateData)
      .withCsrfToken()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertRedirectsTo('/')

    app.container.restore(EventService)
  })

  test('Successfully updates event dates', async ({ client, assert }) => {
    const eventId = 1
    const start = DateTime.now().toISO()
    const end = DateTime.now().plus({ hours: 2 }).toISO()

    class MockedEventService extends EventService {
      async updateEventDates(id: number, start: string, end: string): Promise<void> {
        assert.equal(id, eventId)
        assert.equal(start, start)
        assert.equal(end, end)
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .put(`${ROUTE_EVENTS_UPDATE}/${eventId}/dates`)
      .form({ start, end })
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertRedirectsTo(ROUTE_EVENTS_INDEX)
    response.assertInertiaPropsContains({ success: 'Event dates updated successfully' })

    app.container.restore(EventService)
  })

  test('delete method successfully deletes an event', async ({ client, assert }) => {
    const eventId = 1

    class MockedEventService extends EventService {
      async deleteEvent(id: number): Promise<void> {
        assert.equal(id, eventId)
      }
    }

    app.container.swap(EventService, () => new MockedEventService())

    const response = await client
      .delete(`/admin/dashboard/events/delete/${eventId}`)
      .withCsrfToken()
      .withInertia()
      .loginAs(mockUser)

    response.assertStatus(200)
    response.assertInertiaPropsContains({ success: 'Event deleted successfully' })

    app.container.restore(EventService)
  })
})
