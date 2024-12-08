import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicSet } from './helpers/setup.js'
import Roles from '#enums/roles'
import Set from '#models/set'

test.group('Sets delete', () => {
  test('admin can delete set', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const set = await createBasicSet()

    const response = await client
      .delete(route('delete.set', [set.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.set'))
    response.assertInertiaPropsContains({
      success: 'Set deleted successfully',
    })

    const deletedSet = await Set.find(set.id)
    assert.isNull(deletedSet, 'Set should be deleted')
  })

  test('non-admin cannot delete set', async ({ client, route, assert }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const set = await createBasicSet()

    const response = await client
      .delete(route('delete.set', [set.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(403)

    const setStillExists = await Set.find(set.id)
    assert.isNotNull(setStillExists)
  })
})
