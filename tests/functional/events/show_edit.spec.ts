import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicEvent } from './helpers/setup.js'
import Roles from '#enums/roles'
import { EventType } from '#enums/event_type'

test.group('Events show/edit', () => {
  test('admin can view event details', async ({ client, route }) => {
    const admin = await createAdminUser()
    const event = await createBasicEvent({ type: EventType.STUDIO_SHOOT, withItem: true })

    const response = await client
      .get(route('show.event', [event.id]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Show')
  })

  test('photographer can view and edit studio shoot events', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const response = await client
      .get(route('edit.event', [event.id]))
      .withInertia()
      .loginAs(photographer)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Edit')
  })

  test('decorator cannot edit studio shoot events', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const event = await createBasicEvent({
      type: EventType.STUDIO_SHOOT,
      withItem: true,
    })

    const response = await client
      .get(route('edit.event', [event.id]))
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(403)
  })

  test('decorator can edit set preparation events', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const event = await createBasicEvent({
      type: EventType.SET_PREPARATION,
      withSet: true,
    })

    const response = await client
      .get(route('edit.event', [event.id]))
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Edit')
  })

  test('returns 404 for non-existent event', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client
      .get(route('show.event', [9999]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(404)
  })
})
