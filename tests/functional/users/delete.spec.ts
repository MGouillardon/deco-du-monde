import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from './helpers/setup.js'
import User from '#models/user'
test.group('Users delete', () => {
  test('admin can delete user', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const userToDelete = await createTestUser()
    const response = await client
      .delete(route('delete.user', [userToDelete.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.user'))
    response.assertInertiaPropsContains({
      success: 'User deleted successfully',
    })

    const deletedUser = await User.find(userToDelete.id)
    assert.isNull(deletedUser, 'User was not deleted')
  })
  test('non-admin cannot delete users', async ({ client, route, assert }) => {
    const nonAdmin = await createTestUser()
    const userToDelete = await createTestUser()
    const response = await client
      .delete(route('delete.user', [userToDelete.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(nonAdmin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Index')
    response.assertInertiaPropsContains({
      errors: 'You are not authorized to access this page',
    })

    const userStillExists = await User.find(userToDelete.id)
    assert.exists(userStillExists, 'User was deleted despite lacking permission')
  })
})
