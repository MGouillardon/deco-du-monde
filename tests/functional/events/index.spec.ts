import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicEvent, createEventWithAssignments } from './helpers/setup.js'
import Roles from '#enums/roles'
import { EventType } from '#enums/event_type'

test.group('Events index', () => {
  test('admin can view all events', async ({ client, route }) => {
    const admin = await createAdminUser()
    await createBasicEvent()

    const response = await client.get(route('index.event')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Index')
    response.assertInertiaPropsContains({
      title: 'Calendar',
      can: {
        create: true,
      },
    })
  })

  test('photographer can only view assigned events', async ({ client, route, assert }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const ownEvent = await createEventWithAssignments(photographer)
    const otherEvent = await createBasicEvent()

    const response = await client.get(route('index.event')).withInertia().loginAs(photographer)

    response.assertStatus(200)
    const events = response.inertiaProps.events

    assert.isArray(events)
    assert.lengthOf(
      events.filter((e: any) => e.id === ownEvent.id),
      1
    )
    assert.lengthOf(
      events.filter((e: any) => e.id === otherEvent.id),
      0
    )
  })

  test('events include all required data', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const response = await client.get(route('index.event')).withInertia().loginAs(admin)

    const event = response.inertiaProps.events[0]
    assert.exists(event.id)
    assert.exists(event.title)
    assert.exists(event.start)
    assert.exists(event.end)
    assert.exists(event.location)
    assert.exists(event.type)
    assert.exists(event.assignments)
  })
})
