import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicEvent } from './helpers/setup.js'
import Roles from '#enums/roles'
import { EventType } from '#enums/event_type'
import { DateTime } from 'luxon'

test.group('Events update', () => {
  test('admin can update any event', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const updateData = {
      locationId: event.locationId,
      type: EventType.STUDIO_SHOOT,
      startTime: DateTime.now().plus({ days: 1 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      endTime: DateTime.now().plus({ days: 1, hours: 2 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      assignments: [{ userId: admin.id, role: 'admin' }],
    }

    const response = await client
      .put(route('update.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form(updateData)

    response.assertStatus(200)
    response.assertRedirectsTo(route('index.event'))
    response.assertInertiaPropsContains({
      success: 'Event updated successfully',
    })

    await event.refresh()
    assert.equal(event.locationId, updateData.locationId)
  })

  test('photographer can update studio shoot events', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const updateData = {
      locationId: event.locationId,
      type: EventType.STUDIO_SHOOT,
      startTime: DateTime.now().plus({ days: 1 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      endTime: DateTime.now().plus({ days: 1, hours: 2 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      assignments: [{ userId: photographer.id, role: 'photographer' }],
    }

    const response = await client
      .put(route('update.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form(updateData)

    response.assertStatus(200)
  })

  test('photographer cannot update set events', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createBasicEvent({
      type: EventType.SET_PREPARATION,
      withSet: true,
    })

    const updateData = {
      locationId: event.locationId,
      type: EventType.SET_PREPARATION,
      startTime: DateTime.now().plus({ days: 1 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      endTime: DateTime.now().plus({ days: 1, hours: 2 }).toFormat("yyyy-MM-dd'T'HH:mm"),
      assignments: [{ userId: photographer.id, role: 'photographer' }],
    }

    const response = await client
      .put(route('update.event', [event.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form(updateData)

    response.assertStatus(403)
  })
})
