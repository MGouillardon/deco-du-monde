import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicSet } from './helpers/setup.js'
import Roles from '#enums/roles'

test.group('Sets index', () => {
  test('admin can view sets listing', async ({ client, route }) => {
    const admin = await createAdminUser()
    await createBasicSet()

    const response = await client.get(route('listing.set')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Index')
    response.assertInertiaPropsContains({
      title: 'Listing Sets',
      can: {
        create: true,
        update: true,
        delete: true,
        validateInstallation: true,
        validateUninstallation: true,
        validatePhotography: true,
      },
    })
  })

  test('decorator can view sets with correct permissions', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    await createBasicSet()

    const response = await client.get(route('listing.set')).withInertia().loginAs(decorator)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Index')
    response.assertInertiaPropsContains({
      can: {
        create: true,
        update: true,
        delete: false,
        validateInstallation: true,
        validateUninstallation: true,
        validatePhotography: false,
      },
    })
  })

  test('sets are properly paginated', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    await Promise.all([...Array(15)].map(() => createBasicSet()))

    const response = await client.get(route('listing.set')).withInertia().loginAs(admin)

    response.assertStatus(200)
    const { sets } = response.inertiaProps

    assert.equal(sets.meta.perPage, 10)
    assert.equal(sets.meta.currentPage, 1)
    assert.equal(sets.meta.firstPage, 1)
    assert.exists(sets.meta.firstPageUrl)
    assert.exists(sets.meta.lastPageUrl)
    assert.exists(sets.meta.nextPageUrl)
    assert.isNull(sets.meta.previousPageUrl)

    assert.equal(sets.data.length, 10)
    assert.isArray(sets.data)

    const firstSet = sets.data[0]
    assert.exists(firstSet.id)
    assert.exists(firstSet.name)
    assert.exists(firstSet.description)
    assert.exists(firstSet.createdAt)
    assert.exists(firstSet.updatedAt)
  })

  test('sets include related data', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    await createBasicSet()

    const response = await client.get(route('listing.set')).withInertia().loginAs(admin)

    const firstSet = response.inertiaProps.sets.data[0]

    assert.isArray(firstSet.items)
    assert.isArray(firstSet.validations)
  })
})
