import { test } from '@japa/runner'
import { createAdminUser, testUserData, createTestUser } from './helpers/setup.js'
import Roles from '#enums/roles'

test.group('Users create', () => {
  test('admin can access create user form', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client.get(route('create.user')).withInertia().loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Users/Create')
  })

  test('admin can create new user', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client
      .post(route('store.user'))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form({
        ...testUserData,
        roleId: Roles.PHOTOGRAPH,
      })

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.user'))
    response.assertInertiaPropsContains({
      success: 'User created successfully',
    })
  })

  test('non-admin cannot create users', async ({ client, route }) => {
    const user = await createTestUser()

    const response = await client
      .post(route('store.user'))
      .withCsrfToken()
      .withInertia()
      .loginAs(user)
      .form({
        ...testUserData,
        roleId: Roles.PHOTOGRAPH,
      })

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Index')
    response.assertInertiaPropsContains({
      errors: 'You are not authorized to access this page',
    })
  })
})
