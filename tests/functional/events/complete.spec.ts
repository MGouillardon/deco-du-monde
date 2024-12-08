import { test } from '@japa/runner'
import { createTestUser } from '../users/helpers/setup.js'
import { createBasicEvent } from './helpers/setup.js'
import Roles from '#enums/roles'
import { EventType } from '#enums/event_type'
import Event from '#models/event'

test.group('Events complete', () => {
  test('photographer can complete studio shoot events', async ({ client, route, assert }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const response = await client
      .post(route('complete.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .header('Referer', route('index.event'))

    response.assertStatus(200)
    response.assertInertiaPropsContains({
      success: 'Event marked as completed',
    })

    const updatedEvent = await Event.findOrFail(event.id)
    assert.equal(updatedEvent.completed, true)
    assert.exists(updatedEvent.completedAt)

    await updatedEvent.load('item')
  })

  test('decorator can complete set preparation events', async ({ client, route, assert }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const event = await createBasicEvent({
      type: EventType.SET_PREPARATION,
      withSet: true,
    })

    const response = await client
      .post(route('complete.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(200)

    const updatedEvent = await Event.findOrFail(event.id)
    assert.equal(updatedEvent.completed, true)
    assert.exists(updatedEvent.completedAt)
  })

  test('photographer cannot complete set preparation events', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createBasicEvent({
      type: EventType.SET_PREPARATION,
      withSet: true,
    })

    const response = await client
      .post(route('complete.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)

    response.assertStatus(403)
  })

  test('assistant photographer can complete studio shoot events', async ({ client, route }) => {
    const assistant = await createTestUser(Roles.ASSISTANT_PHOTOGRAPH)
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const response = await client
      .post(route('complete.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(assistant)

    response.assertStatus(200)
  })
})
