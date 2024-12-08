import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicSet, testSetData } from './helpers/setup.js'
import Roles from '#enums/roles'
import Item from '#models/item'

test.group('Sets update', () => {
  test('admin can update set', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const set = await createBasicSet()
    const items = await Item.createMany([
      { name: 'Item 1', description: 'Description 1' },
      { name: 'Item 2', description: 'Description 2' },
    ])

    const updateData = {
      name: 'Updated Set Name',
      description: 'Updated Description',
      itemIds: items.map((item) => item.id),
    }

    const response = await client
      .put(route('update.set', [set.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form(updateData)

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.set'))
    response.assertInertiaPropsContains({
      success: 'Set updated successfully',
    })

    const updatedSet = await set.refresh()
    await updatedSet.load('items')
    assert.equal(updatedSet.name, updateData.name)
    assert.equal(updatedSet.description, updateData.description)
    assert.lengthOf(updatedSet.items, 2)
  })

  test('decorator can update set', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const set = await createBasicSet()

    const response = await client
      .put(route('update.set', [set.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)
      .form({
        ...testSetData,
        name: 'Decorator Update',
      })

    response.assertStatus(200)
    response.assertInertiaPropsContains({
      success: 'Set updated successfully',
    })
  })

  test('photographer cannot update set', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const set = await createBasicSet()

    const response = await client
      .put(route('update.set', [set.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form(testSetData)

    response.assertStatus(403)
  })

  test('validates required fields', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const set = await createBasicSet()

    const response = await client
      .put(route('update.set', [set.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form({})
      .header('Referer', route('listing.set'))

    response.assertStatus(200)
    assert.exists(response.inertiaProps.errors)
    assert.exists(response.inertiaProps.errors.name)
  })
})
