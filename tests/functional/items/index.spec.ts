import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicItem } from './helpers/setup.js'
import Roles from '#enums/roles'
import { LocationType } from '#enums/location_type'

test.group('Items index', () => {
  test('admin can view items listing', async ({ client, route }) => {
    const admin = await createAdminUser()
    await createBasicItem()

    const response = await client.get(route('listing.item')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Index')
    response.assertInertiaPropsContains({
      title: 'Listing items',
      locationType: LocationType,
      can: {
        create: true,
        update: true,
        delete: true,
        validateStudioPhoto: true,
      },
    })
  })

  test('photographer can view items with correct permissions', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    await createBasicItem()

    const response = await client.get(route('listing.item')).withInertia().loginAs(photographer)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Index')
    response.assertInertiaPropsContains({
      can: {
        create: true,
        update: true,
        delete: false,
        validateStudioPhoto: true,
      },
    })
  })

  test('regular user can view items with limited permissions', async ({ client, route }) => {
    const user = await createTestUser(Roles.DECORATOR)
    await createBasicItem()

    const response = await client.get(route('listing.item')).withInertia().loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Index')
    response.assertInertiaPropsContains({
      can: {
        create: false,
        update: false,
        delete: false,
        validateStudioPhoto: false,
      },
    })
  })

  test('items are properly paginated', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    await Promise.all([...Array(15)].map(() => createBasicItem()))

    const response = await client.get(route('listing.item')).withInertia().loginAs(admin)

    response.assertStatus(200)
    const { items } = response.inertiaProps

    assert.equal(items.meta.perPage, 10)
    assert.equal(items.meta.currentPage, 1)
    assert.equal(items.meta.firstPage, 1)
    assert.exists(items.meta.firstPageUrl)
    assert.exists(items.meta.lastPageUrl)
    assert.exists(items.meta.nextPageUrl)
    assert.isNull(items.meta.previousPageUrl)

    assert.equal(items.data.length, 10)
    assert.isArray(items.data)

    const firstItem = items.data[0]
    assert.exists(firstItem.id)
    assert.exists(firstItem.name)
    assert.exists(firstItem.description)
    assert.exists(firstItem.isPhotographedStudio)
    assert.exists(firstItem.createdAt)
    assert.exists(firstItem.updatedAt)
  })

  test('items include related data', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    await createBasicItem()

    const response = await client.get(route('listing.item')).withInertia().loginAs(admin)

    const firstItem = response.inertiaProps.items.data[0]

    assert.exists(firstItem.itemStatus)
    assert.isArray(firstItem.sets)
    assert.isArray(firstItem.validations)
  })
})
