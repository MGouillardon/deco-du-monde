import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from './helpers/setup.js'
import Roles from '#enums/roles'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

test.group('Users update', () => {
  test('admin can access edit form', async ({ client, route }) => {
    const admin = await createAdminUser()
    const userToEdit = await createTestUser()

    const response = await client
      .get(route('edit.user', [userToEdit.id]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Users/Edit')
    response.assertInertiaPropsContains({
      user: {
        id: userToEdit.id,
        fullName: userToEdit.fullName,
        email: userToEdit.email,
      },
    })
  })

  test('admin can update user', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const userToEdit = await createTestUser(Roles.PHOTOGRAPH)
    const updateResponse = await client
      .put(route('update.user', [userToEdit.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form({
        fullName: 'Updated Name',
        email: userToEdit.email,
        roleId: Roles.DECORATOR,
      })

    updateResponse.assertStatus(200)
    updateResponse.assertRedirectsTo(route('listing.user'))
    updateResponse.assertInertiaPropsContains({
      success: 'User updated successfully',
    })

    await db.manager.closeAll()

    const updatedUser = await User.query().where('id', userToEdit.id).preload('role').firstOrFail()

    assert.equal(updatedUser.fullName, 'Updated Name')
    assert.equal(updatedUser.roleId, Roles.DECORATOR)
    assert.equal(updatedUser.role.name, 'decorator')
  })

  test('non-admin cannot update users', async ({ client, route }) => {
    const regularUser = await createTestUser()
    const userToEdit = await createTestUser()

    const response = await client
      .put(route('update.user', [userToEdit.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(regularUser)
      .form({
        fullName: 'Updated Name',
        email: userToEdit.email,
        roleId: Roles.DECORATOR,
      })

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Events/Index')
    response.assertInertiaPropsContains({
      errors: 'You are not authorized to access this page',
    })
  })
})
