import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { testItemData } from './helpers/setup.js'
import Roles from '#enums/roles'
import { ItemStatusType } from '#enums/item_status'
import { LocationType } from '#enums/location_type'
import Item from '#models/item'

test.group('Items create/store', () => {
  test('admin can access create form', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client.get(route('create.item')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Create')
    response.assertInertiaPropsContains({
      title: 'Create item',
      statusOptions: Object.values(ItemStatusType),
    })
  })

  test('photographer can access create form', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)

    const response = await client.get(route('create.item')).withInertia().loginAs(photographer)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Create')
  })

  test('decorator cannot access create form', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)

    const response = await client.get(route('create.item')).withInertia().loginAs(decorator)

    response.assertStatus(403)
  })

  test('admin can create new item', async ({ client, route, assert }) => {
    const admin = await createAdminUser()

    const response = await client
      .post(route('store.item'))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form(testItemData)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.item'))
    response.assertInertiaPropsContains({
      success: 'Item created successfully',
    })
    const item = await Item.query()
      .preload('itemStatus')
      .preload('validations')
      .orderBy('id', 'desc')
      .firstOrFail()

    assert.equal(item.name, testItemData.name)
    assert.equal(item.description, testItemData.description)
    assert.equal(item.isPhotographedStudio, testItemData.isPhotographedStudio)

    assert.equal(item.itemStatus.status, ItemStatusType.NORMAL)

    assert.lengthOf(item.validations, 1)
    assert.equal(item.validations[0].type, LocationType.STUDIO)
    assert.equal(item.validations[0].isValidated, false)
  })

  test('photographer can create new item', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)

    const response = await client
      .post(route('store.item'))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form(testItemData)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.item'))
    response.assertInertiaPropsContains({
      success: 'Item created successfully',
    })
  })

  test('decorator cannot create new item', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)

    const response = await client
      .post(route('store.item'))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)
      .form(testItemData)

    response.assertStatus(403)
  })

  test('validates required fields', async ({ client, route, assert }) => {
    const admin = await createAdminUser()

    const response = await client
      .post(route('store.item'))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form({})
      .header('Referer', route('listing.item'))

    response.assertStatus(200)
    assert.exists(response.inertiaProps.errors)
    assert.exists(response.inertiaProps.errors.name, 'Name validation error should exist')
    assert.exists(
      response.inertiaProps.errors.description,
      'Description validation error should exist'
    )
  })
})
