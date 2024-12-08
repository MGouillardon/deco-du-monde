import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { testEventData } from './helpers/setup.js'
import Roles from '#enums/roles'
import { EventType } from '#enums/event_type'
import Event from '#models/event'

test.group('Events create/store', () => {
  test('admin can access create form', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client.get(route('create.event')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Create')
  })

  test('photographer can create studio shoot events', async ({ client, route, assert }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)

    const response = await client
      .post(route('store.event'))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form({
        ...testEventData,
        type: EventType.STUDIO_SHOOT,
      })

    response.assertStatus(200)
    response.assertRedirectsTo(route('index.event'))

    const event = await Event.query().orderBy('id', 'desc').firstOrFail()
    assert.equal(event.type, EventType.STUDIO_SHOOT)
  })

  test('decorator can create set events', async ({ client, route, assert }) => {
    const decorator = await createTestUser(Roles.DECORATOR)

    const response = await client
      .post(route('store.event'))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)
      .form({
        ...testEventData,
        type: EventType.SET_PREPARATION,
      })

    response.assertStatus(200)
    response.assertRedirectsTo(route('index.event'))

    const event = await Event.query().orderBy('id', 'desc').firstOrFail()
    assert.equal(event.type, EventType.SET_PREPARATION)
  })

  test('validates required fields', async ({ client, route, assert }) => {
    const admin = await createAdminUser()

    const response = await client
      .post(route('store.event'))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form({})
      .header('Referer', route('index.event'))

    response.assertStatus(200)
    const errors = response.inertiaProps.errors
    assert.isArray(errors)

    const hasError = (field: string) =>
      errors.some((error: any) => error.field === field && error.rule === 'required')

    assert.isTrue(hasError('locationId'), 'Should have locationId error')
    assert.isTrue(hasError('startTime'), 'Should have startTime error')
    assert.isTrue(hasError('endTime'), 'Should have endTime error')
    assert.isTrue(hasError('type'), 'Should have type error')
    assert.isTrue(hasError('userIds'), 'Should have userIds error')
  })
})
