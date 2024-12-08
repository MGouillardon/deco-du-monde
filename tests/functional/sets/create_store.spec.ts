import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { testSetData } from './helpers/setup.js'
import Roles from '#enums/roles'
import Set from '#models/set'
import Item from '#models/item'

test.group('Sets create/store', () => {
  test('admin can access create form', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client.get(route('create.set')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Create')
  })

  test('decorator can access create form', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)

    const response = await client.get(route('create.set')).withInertia().loginAs(decorator)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Create')
  })

  test('photographer cannot access create form', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)

    const response = await client.get(route('create.set')).withInertia().loginAs(photographer)

    response.assertStatus(403)
  })

  test('admin can create new set', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const items = await Item.createMany([
      { name: 'Item 1', description: 'Description 1' },
      { name: 'Item 2', description: 'Description 2' },
    ])

    const data = {
      ...testSetData,
      itemIds: items.map((item) => item.id),
    }

    const response = await client
      .post(route('store.set'))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form(data)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.set'))
    response.assertInertiaPropsContains({
      success: 'Set created successfully',
    })

    const set = await Set.query()
      .preload('items')
      .preload('validations')
      .orderBy('id', 'desc')
      .firstOrFail()

    assert.equal(set.name, data.name)
    assert.equal(set.description, data.description)
    assert.lengthOf(set.items, 2)
  })

  test('decorator can create new set', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)

    const response = await client
      .post(route('store.set'))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)
      .form(testSetData)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.set'))
    response.assertInertiaPropsContains({
      success: 'Set created successfully',
    })
  })

  test('photographer cannot create new set', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)

    const response = await client
      .post(route('store.set'))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form(testSetData)

    response.assertStatus(403)
  })

  test('validates required fields', async ({ client, route, assert }) => {
    const admin = await createAdminUser()

    const response = await client
      .post(route('store.set'))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form({})
      .header('Referer', route('listing.set'))

    response.assertStatus(200)
    assert.exists(response.inertiaProps.errors)
    assert.exists(response.inertiaProps.errors.name, 'Name validation error should exist')
  })
})
