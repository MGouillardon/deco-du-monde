import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from './helpers/setup.js'
import Roles from '#enums/roles'

test.group('Users index', () => {
  test('admin can view users listing', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client.get(route('listing.user')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Users/Listing')
    response.assertInertiaPropsContains({
      title: 'Listing',
      can: {
        create: true,
        update: true,
        delete: true,
      },
    })
  })

  test('listing excludes admin users', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    await createTestUser(Roles.PHOTOGRAPH)
    await createTestUser(Roles.DECORATOR)

    const response = await client.get(route('listing.user')).withInertia().loginAs(admin)

    response.assertStatus(200)
    const users = response.inertiaProps.users.data
    assert.notInclude(
      users.map((user) => user.roleId),
      Roles.ADMIN,
      'Response should not contain admin users'
    )
  })

  test('non-admin cannot view users listing', async ({ client, route, assert }) => {
    const user = await createTestUser(Roles.PHOTOGRAPH)

    const response = await client.get(route('listing.user')).withInertia().loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Index')
    response.assertInertiaPropsContains({
      errors: 'You are not authorized to access this page',
    })
    assert.equal(response.body().url, '/admin/dashboard/events/index')
  })
})
