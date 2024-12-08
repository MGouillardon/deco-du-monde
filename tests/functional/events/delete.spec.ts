import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicEvent } from './helpers/setup.js'
import Roles from '#enums/roles'
import Event from '#models/event'

test.group('Events delete', () => {
  test('admin can delete events', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const event = await createBasicEvent()

    const response = await client
      .delete(route('delete.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertRedirectsTo(route('index.event'))
    response.assertInertiaPropsContains({
      success: 'Event deleted successfully',
    })

    const deletedEvent = await Event.find(event.id)
    assert.isNull(deletedEvent)
  })

  test('photographer cannot delete events', async ({ client, route, assert }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createBasicEvent()

    const response = await client
      .delete(route('delete.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)

    response.assertStatus(403)

    const eventStillExists = await Event.find(event.id)
    assert.isNotNull(eventStillExists)
  })

  test('returns 404 for non-existent event', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client
      .delete(route('delete.event', [9999]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)

    response.assertStatus(404)
  })
})
