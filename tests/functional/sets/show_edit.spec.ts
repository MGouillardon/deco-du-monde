import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicSet } from './helpers/setup.js'
import Roles from '#enums/roles'

test.group('Sets show/edit', () => {
  test('admin can view set details', async ({ client, route }) => {
    const admin = await createAdminUser()
    const set = await createBasicSet()

    const response = await client
      .get(route('show.set', [set.id]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Show')
    response.assertInertiaPropsContains({
      title: `Show set: ${set.name}`,
      set: {
        id: set.id,
        name: set.name,
        description: set.description,
      },
      can: {
        update: true,
        delete: true,
        validateInstallation: true,
        validateUninstallation: true,
        validatePhotography: true,
      },
    })
  })

  test('anyone can view set details', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const set = await createBasicSet()

    const response = await client
      .get(route('show.set', [set.id]))
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Show')
  })

  test('admin can access edit form', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const set = await createBasicSet()

    const response = await client
      .get(route('edit.set', [set.id]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Edit')

    assert.exists(response.inertiaProps.set)
    assert.exists(response.inertiaProps.allItems)
    assert.isArray(response.inertiaProps.allItems)

    assert.equal(response.inertiaProps.set.id, set.id)
    assert.equal(response.inertiaProps.set.name, set.name)
    assert.equal(response.inertiaProps.set.description, set.description)
  })

  test('decorator can access edit form', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const set = await createBasicSet()

    const response = await client
      .get(route('edit.set', [set.id]))
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Sets/Edit')
  })

  test('photographer cannot access edit form', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const set = await createBasicSet()

    const response = await client
      .get(route('edit.set', [set.id]))
      .withInertia()
      .loginAs(photographer)

    response.assertStatus(403)
  })

  test('returns 404 for non-existent set', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client
      .get(route('show.set', [9999]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(404)
  })
})
